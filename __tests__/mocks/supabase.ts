import { vi } from "vitest";

/**
 * Supabase query builder mock - chainable methods
 */
export function createMockQueryBuilder(overrides: Record<string, any> = {}) {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn(),
    ...overrides,
  };

  return builder;
}

/**
 * Create a mock Supabase client
 */
export function createMockSupabaseClient(overrides: Record<string, any> = {}) {
  const queryBuilder = createMockQueryBuilder();

  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: { url: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      exchangeCodeForSession: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    },
    from: vi.fn(() => queryBuilder),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "" } }),
      })),
    },
    ...overrides,
  };

  return { client, queryBuilder };
}

/**
 * Setup Supabase server mock - call this to mock createClient
 */
export function setupSupabaseMock() {
  const { client, queryBuilder } = createMockSupabaseClient();

  vi.mock("@/app/util/supabase/server", () => ({
    createClient: vi.fn(async () => client),
  }));

  return { client, queryBuilder };
}

/**
 * Mock authenticated user
 */
export function mockAuthenticatedUser(
  client: any,
  user = { id: "test-user-id", email: "test@example.com" }
) {
  client.auth.getUser.mockResolvedValue({
    data: { user },
    error: null,
  });
  return user;
}

/**
 * Mock unauthenticated user
 */
export function mockUnauthenticatedUser(client: any) {
  client.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: "User not found", status: 401 },
  });
}

/**
 * Helper to create chainable query mock with specific result
 */
export function mockQueryResult(
  queryBuilder: any,
  tableName: string,
  result: { data?: any; error?: any; count?: number }
) {
  const chain = createMockQueryBuilder({
    single: vi.fn().mockResolvedValue({
      data: result.data ?? null,
      error: result.error ?? null,
    }),
    maybeSingle: vi.fn().mockResolvedValue({
      data: result.data ?? null,
      error: result.error ?? null,
    }),
    then: vi.fn((cb: Function) =>
      cb({
        data: result.data ?? null,
        error: result.error ?? null,
        count: result.count,
      })
    ),
  });

  // Override the default resolved value for terminal methods
  if (result.count !== undefined) {
    chain.select = vi.fn().mockReturnValue({
      ...chain,
      eq: vi.fn().mockReturnValue({
        ...chain,
      }),
    });
  }

  return chain;
}
