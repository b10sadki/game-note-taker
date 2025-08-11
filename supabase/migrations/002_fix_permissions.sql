-- Grant permissions to anon and authenticated roles for games table
GRANT SELECT ON games TO anon;
GRANT ALL PRIVILEGES ON games TO authenticated;

-- Grant permissions for notes table
GRANT SELECT ON notes TO anon;
GRANT ALL PRIVILEGES ON notes TO authenticated;

-- Grant permissions for solutions table
GRANT SELECT ON solutions TO anon;
GRANT ALL PRIVILEGES ON solutions TO authenticated;

-- Check current permissions
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;