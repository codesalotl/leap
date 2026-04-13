# LEAP - Permissions Mapping

## Overview

This document defines the role-based and office-based access control system for LEAP. The system supports granular permissions at both the role level and office level.

## User Roles

### Super Admin
- System-wide access
- Can manage all offices, users, and resources
- Can assign roles and permissions to other users

### Office Admin
- Full access to their assigned office's resources
- Can manage users within their office
- Can approve/reject requests within their office

### Office User
- Read access to their office's resources
- Can create/edit resources assigned to them
- Cannot approve/reject requests

### Viewer
- Read-only access to their office's resources
- Cannot make any modifications

## Permission Structure

### Format
Permissions follow the pattern: `{resource}.{action}`

### Resource Categories

#### User Management
- `users.view_any` - View list of users
- `users.view` - View specific user details
- `users.create` - Create new users
- `users.update` - Update user information
- `users.delete` - Delete users
- `users.approve` - Approve user registration
- `users.update_status` - Change user status

#### Office Management
- `offices.view_any` - View list of offices
- `offices.view` - View specific office details
- `offices.create` - Create new offices
- `offices.update` - Update office information
- `offices.delete` - Delete offices

#### PPMP Management
- `ppmp.view_any` - View PPMP lists
- `ppmp.view` - View specific PPMP
- `ppmp.create` - Create PPMP
- `ppmp.update` - Update PPMP
- `ppmp.delete` - Delete PPMP
- `ppmp.approve` - Approve PPMP
- `ppmp.submit` - Submit PPMP for approval

#### AIP Management
- `aip.view_any` - View AIP entries
- `aip.view` - View specific AIP entry
- `aip.create` - Create AIP entries
- `aip.update` - Update AIP entries
- `aip.delete` - Delete AIP entries

#### PPA Management
- `ppa.view_any` - View PPA lists
- `ppa.view` - View specific PPA
- `ppa.create` - Create PPA
- `ppa.update` - Update PPA
- `ppa.delete` - Delete PPA
- `ppa.approve` - Approve PPA

#### Chart of Accounts
- `coa.view_any` - View chart of accounts
- `coa.view` - View specific account
- `coa.create` - Create accounts
- `coa.update` - Update accounts
- `coa.delete` - Delete accounts

## Office-Based Access Control

### Scope Rules

1. **Same Office Access**: Users can only access resources within their assigned office
2. **Cross-Office Access**: Only Super Admin can access resources across offices
3. **Hierarchy**: Office Admin can manage users within their office only

### Permission Matrix

| Role | users.view_any | users.create | users.update | users.approve | ppmp.approve | ppa.approve |
|------|----------------|--------------|--------------|---------------|--------------|-------------|
| Super Admin | All offices | All offices | All offices | All offices | All offices | All offices |
| Office Admin | Own office | Own office | Own office | Own office | Own office | Own office |
| Office User | Own office | None | Own profile | None | None | None |
| Viewer | Own office | None | None | None | None | None |

## Database Schema

### Permissions Table
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Roles Table (extend existing)
```sql
ALTER TABLE users ADD COLUMN role ENUM('super_admin', 'office_admin', 'office_user', 'viewer') DEFAULT 'office_user';
```

### Office Permissions Pivot Table
```sql
CREATE TABLE office_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    office_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY (office_id, permission_id)
);
```

### User Permissions Pivot Table
```sql
CREATE TABLE user_permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, permission_id)
);
```

## Implementation Approach

### Step 1: Create Permission System
- Create permissions table and seed with all permissions
- Create pivot tables for office and user permissions
- Create Permission model and relationships

### Step 2: Update User Model
- Add `hasPermission()` method
- Add `hasOfficePermission()` method
- Add relationships to permissions

### Step 3: Update Policies
- Refactor UserPolicy to use permission checks
- Create policies for each resource type
- Implement office scoping in policies

### Step 4: Update Controllers
- Add `authorize()` calls using policies
- Remove middleware-based auth where appropriate
- Keep `auth` middleware, replace `admin` with policy checks

### Step 5: Update Routes
- Remove `admin` middleware from routes
- Keep `auth` middleware
- Let policies handle role/permission checks

### Step 6: Frontend Integration
- Pass permissions to Inertia props
- Use permission checks in React components
- Show/hide UI elements based on permissions

## Example Policy Implementation

### UserPolicy Example
```php
public function viewAny(User $user): bool
{
    // Super admin can view all users
    if ($user->role === 'super_admin') {
        return true;
    }
    
    // Office admin can view users in their office
    if ($user->role === 'office_admin') {
        return $user->hasPermission('users.view_any');
    }
    
    // Other roles can view based on permissions
    return $user->hasPermission('users.view_any');
}

public function update(User $user, User $model): bool
{
    // Super admin can update anyone
    if ($user->role === 'super_admin') {
        return true;
    }
    
    // Office admin can update users in their office
    if ($user->role === 'office_admin' && $user->office_id === $model->office_id) {
        return $user->hasPermission('users.update');
    }
    
    // Users can update their own profile
    if ($user->id === $model->id) {
        return $user->hasPermission('users.update');
    }
    
    return false;
}
```

## Migration Order

1. Create permissions table
2. Seed permissions
3. Create office_permissions pivot table
4. Create user_permissions pivot table
5. Update users table role column
6. Update models and policies
7. Update controllers and routes
