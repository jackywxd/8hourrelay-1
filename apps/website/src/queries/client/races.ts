"use client";

import useSWR from "swr";
import { useAuth } from "@/hooks/use-auth";
import { setQueryString } from "@/lib/utils";
import { UserAPI, UsersAPI } from "@/types/api";

export function useRaceAPI() {
  const url = `/api/v1/race`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    UserAPI,
    Error
  >(url);

  console.log(data);
  return {
    user: data?.data ?? null,
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  };
}

export function useUsersAPI(
  id: string | null,
  params?: { page?: number; perPage?: number },
) {
  const query = setQueryString({ id, ...params });
  const url = query ? `/api/v1/user/list?${query}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    UsersAPI,
    Error
  >(url);

  return {
    users: data?.data?.users ?? [],
    error: error ?? data?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  };
}
