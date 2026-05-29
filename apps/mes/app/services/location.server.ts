import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as cookie from "cookie";

export function getCompanySettings(request: Request, companyId: string) {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[companyId] : null;
  if (parsed && !parsed.includes(":")) {
    // temporary check for backwards compatibility
    return { location: parsed };
  }
  return {
    location: undefined
  };
}

export function setLocation(companyId: string, locationId: string) {
  return cookie.serialize(companyId, locationId, {
    path: "/",
    maxAge: 31536000
  });
}

export async function getLocation(
  request: Request,
  client: SupabaseClient<Database>,
  args: {
    userId: string;
    companyId: string;
  }
) {
  const { userId, companyId } = args;
  let { location } = getCompanySettings(request, companyId);

  let updated = false;

  if (!location) {
    const employeeJob = await client
      .from("employeeJob")
      .select("locationId")
      .eq("id", userId)
      .eq("companyId", companyId)
      .single();

    if (employeeJob.data && employeeJob.data.locationId) {
      location = employeeJob.data.locationId;
      updated = true;
    } else {
      const locations = await client
        .from("location")
        .select("id")
        .eq("companyId", companyId);
      if (locations.data && locations.data.length > 0) {
        location = locations.data[0].id;
        updated = true;
      }
    }
  }

  if (!location) {
    // 返回 null 而不是抛出错误，让调用方决定如何处理
    return { location: null, updated: false };
  }

  if (updated) {
    setLocation(companyId, location);
  }

  return { location, updated };
}
