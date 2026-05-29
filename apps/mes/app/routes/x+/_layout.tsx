import {
  CarbonEdition,
  CarbonProvider,
  CONTROLLED_ENVIRONMENT,
  getCarbon,
  getCompanies,
  getUser
} from "@carbon/auth";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import {
  destroyAuthSession,
  requireAuthSession
} from "@carbon/auth/session.server";
import {
  ItarPopup,
  SidebarProvider,
  TooltipProvider,
  useKeyboardWedge,
  useMount,
  useNProgress
} from "@carbon/react";
import { getStripeCustomerByCompanyId } from "@carbon/stripe/stripe.server";
import { Edition } from "@carbon/utils";
import { Trans } from "@lingui/react/macro";
import posthog from "posthog-js";
import { Suspense } from "react";
import type {
  LoaderFunctionArgs,
  MiddlewareFunction,
  ShouldRevalidateFunction
} from "react-router";
import {
  Await,
  data,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate
} from "react-router";
import { AppSidebar } from "~/components";
import { ConsolePill } from "~/components/ConsolePill";
import { PinInOverlay } from "~/components/PinInOverlay";
import RealtimeDataProvider from "~/components/RealtimeDataProvider";
import { TimeCardWarning } from "~/components/TimeCardWarning";
import { userContext } from "~/context";
import { userMiddleware } from "~/middleware/user";
import { refreshConsolePinIn } from "~/services/console.server";
import { getActiveMaintenanceEventsCount } from "~/services/maintenance.service";
import {
  getActiveJobCount,
  getLocationsByCompany
} from "~/services/operations.service";
import { getOpenClockEntry } from "~/services/people.service";
import { ERP_URL, MES_URL, path } from "~/utils/path";

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  defaultShouldRevalidate
}) => {
  if (
    currentUrl.pathname.startsWith("/refresh-session") ||
    currentUrl.pathname.startsWith("/switch-company")
  ) {
    return true;
  }

  return defaultShouldRevalidate;
};

export const middleware: MiddlewareFunction[] = [userMiddleware];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { accessToken, companyId, expiresAt, expiresIn, userId } =
    await requireAuthSession(request, { verify: true });

  // share a client between requests
  const client = getCarbon(accessToken);

  // parallelize the requests
  const [companies, user] = await Promise.all([
    getCompanies(client, userId),
    getUser(client, userId)
  ]);

  if (user.error || !user.data) {
    await destroyAuthSession(request);
  }

  const company = companies.data?.find((c) => c.companyId === companyId);
  if (!company) {
    throw redirect(path.to.accountSettings);
  }

  // Get the location and console state from middleware context
  const ctx = context.get(userContext);
  const locationId = ctx?.locationId;
  const consoleMode = ctx?.consoleMode ?? false;
  const pinnedInUser = ctx?.pinnedInUser ?? null;
  const effectiveUserId = ctx?.effectiveUserId ?? userId;

  const serviceRole = getCarbonServiceRole();

  let [
    companyPlan,
    locations,
    activeEvents,
    companySettings,
    openClockEntry,
    locationEmployees
  ] = await Promise.all([
    getStripeCustomerByCompanyId(companyId, userId),
    getLocationsByCompany(client, companyId),
    getActiveJobCount(client, {
      employeeId: effectiveUserId,
      companyId
    }),
    client
      .from("companySettings")
      .select("timeCardEnabled, consoleEnabled")
      .eq("id", companyId)
      .single(),
    getOpenClockEntry(client, effectiveUserId, companyId),
    // Get employees at current location for console mode pin-in filtering
    consoleMode && locationId
      ? serviceRole
          .from("employeeJob")
          .select("id")
          .eq("locationId", locationId)
          .eq("companyId", companyId)
      : Promise.resolve({ data: [] as { id: string }[] })
  ]);

  const locationEmployeeIds =
    locationEmployees.data?.map((e: { id: string }) => e.id) ?? [];
  const timeCardEnabled =
    (companySettings.data as any)?.timeCardEnabled ?? false;
  const consoleEnabled = (companySettings.data as any)?.consoleEnabled ?? false;

  // Get active maintenance count after we have the location
  const activeMaintenanceCount = await getActiveMaintenanceEventsCount(
    client,
    locationId
  );

  if (!companyPlan && CarbonEdition === Edition.Cloud) {
    throw redirect(path.to.onboarding);
  }

  if (!locations.data || locations.data.length === 0) {
    // 没有 location 时，返回空数组，让前端显示提示
    return data({
      session: {
        accessToken,
        expiresIn,
        expiresAt
      },
      activeEvents: 0,
      activeMaintenanceCount: 0,
      company,
      companies: companies.data ?? [],
      consoleEnabled: false,
      consoleMode: false,
      location: null,
      locationEmployeeIds: [],
      locations: [],
      openClockEntry: null,
      effectiveUserId: userId,
      pinnedInUser: null,
      plan: companyPlan?.planId,
      timeCardEnabled: false,
      user: user.data,
      noLocations: true // 标记没有 location
    });
  }

  // Sliding window: refresh pin-in cookie on every page load
  const headers = new Headers();
  if (pinnedInUser && ctx) {
    headers.append(
      "Set-Cookie",
      refreshConsolePinIn(companyId, {
        userId: pinnedInUser.userId,
        name: pinnedInUser.name,
        avatarUrl: pinnedInUser.avatarUrl,
        pinnedAt: Date.now()
      })
    );
  }

  return data(
    {
      session: {
        accessToken,
        expiresIn,
        expiresAt
      },
      activeEvents: activeEvents.data ?? 0,
      activeMaintenanceCount: activeMaintenanceCount.count ?? 0,
      company,
      companies: companies.data ?? [],
      consoleEnabled,
      consoleMode: consoleEnabled && consoleMode,
      location: locationId,
      locationEmployeeIds,
      locations: locations.data ?? [],
      openClockEntry: openClockEntry?.data
        ? getOpenClockEntry(client, userId, companyId)
        : null,
      effectiveUserId,
      pinnedInUser,
      plan: companyPlan?.planId,
      timeCardEnabled,
      user: user.data,
      noLocations: false
    },
    headers.has("Set-Cookie") ? { headers } : undefined
  );
}

export default function AuthenticatedRoute() {
  const {
    session,
    activeEvents,
    activeMaintenanceCount,
    company,
    companies,
    consoleEnabled,
    consoleMode,
    location,
    locationEmployeeIds,
    locations,
    openClockEntry,
    pinnedInUser,
    timeCardEnabled,
    user,
    noLocations
  } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  useNProgress();
  useKeyboardWedge({
    test: (input) =>
      (input.startsWith(MES_URL) || input.startsWith(ERP_URL)) &&
      !input.includes("/kanban/complete/"), // we handle this more gracefully in JobOperation
    callback: (input) => {
      try {
        const url = new URL(input);
        navigate(url.pathname + url.search);
      } catch {
        navigate(input);
      }
    }
  });

  useMount(() => {
    posthog.identify(user?.id, {
      email: user?.email,
      name: `${user?.firstName} ${user?.lastName}`
    });
  });

  return (
    <div className="h-screen w-screen overflow-y-auto md:overflow-hidden">
      {user?.acknowledgedITAR === false && CONTROLLED_ENVIRONMENT ? (
        <ItarPopup
          acknowledgeAction={path.to.acknowledge}
          logoutAction={path.to.logout}
        />
      ) : noLocations ? (
        // 没有 location 时显示友好提示
        <div className="flex items-center justify-center h-full bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-4">
                <svg
                  className="h-12 w-12 text-yellow-600 dark:text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                <Trans>需要创建车间位置</Trans>
              </h1>
              <p className="text-muted-foreground">
                <Trans>
                  MES 车间管理系统需要至少一个车间位置才能使用。请前往 ERP
                  系统的资源模块创建车间位置。
                </Trans>
              </p>
            </div>
            <div className="space-y-3">
              <a
                href={`${ERP_URL}/x/resources/locations/new`}
                className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                <Trans>创建车间位置</Trans>
              </a>
              <a
                href={ERP_URL}
                className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
              >
                <Trans>返回 ERP</Trans>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <CarbonProvider session={session}>
          <RealtimeDataProvider>
            <SidebarProvider defaultOpen={false}>
              <TooltipProvider delayDuration={200}>
                <AppSidebar
                  activeEvents={activeEvents}
                  activeMaintenanceCount={activeMaintenanceCount}
                  company={company}
                  companies={companies}
                  consoleEnabled={consoleEnabled}
                  consoleMode={consoleMode}
                  location={location}
                  locations={locations}
                  openClockEntry={openClockEntry}
                  pinnedInUser={pinnedInUser}
                  timeCardEnabled={timeCardEnabled}
                />
                <Outlet />
                {timeCardEnabled && (
                  <Suspense fallback={null}>
                    <Await resolve={openClockEntry}>
                      {(resolved) => (
                        <TimeCardWarning
                          openClockEntry={
                            resolved?.data
                              ? {
                                  id: resolved.data.id,
                                  clockIn: resolved.data.clockIn
                                }
                              : null
                          }
                        />
                      )}
                    </Await>
                  </Suspense>
                )}
                {consoleMode && !pinnedInUser && (
                  <PinInOverlay
                    companyId={company.companyId!}
                    locationEmployeeIds={locationEmployeeIds}
                    sessionUserId={user?.id ?? ""}
                    hasPinnedUser={false}
                  />
                )}
                {consoleMode && pinnedInUser && (
                  <ConsolePill
                    user={pinnedInUser}
                    companyId={company.companyId!}
                    locationEmployeeIds={locationEmployeeIds}
                    sessionUserId={user?.id ?? ""}
                  />
                )}
              </TooltipProvider>
            </SidebarProvider>
          </RealtimeDataProvider>
        </CarbonProvider>
      )}
    </div>
  );
}
