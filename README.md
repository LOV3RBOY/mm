# Modern Model Management

A modern platform for model management.

## Environment Variables

This project requires the following environment variables to be set:

### Supabase Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (client-side)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (client-side)
- `SUPABASE_URL`: Your Supabase project URL (server-side)
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key (server-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side)

You can copy the `.env.example` file to `.env.local` and fill in the values:

```bash
cp .env.example .env.local

