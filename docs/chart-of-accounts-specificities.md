# Chart of Accounts Specificities

## Overview
The Chart of Accounts (COA) follows the Philippine Government's Revised Chart of Accounts as per COA Circular No. 2015-009. This document outlines the implemented structure and requirements for the COA in the LEAP system.

## ✅ IMPLEMENTED STRUCTURE

### Account Number Structure
**Format:** `X-XX-XX-XXXX` (Dashed RCA Format)

- **X** = Major Account Classification (1-9)
- **XX** = Object Code  
- **XX** = Sub-Object Code
- **XXXX** = UACS Object Code

### Examples:
- `5-02-03-010` = Office Supplies Expenses
- `5-01-01-010` = Salaries and Wages-Regular
- `5-03-01-010` = Management Supervision/Trusteeship Fees

### Note:
- **Official COA format**: Plain numeric (e.g., `50203010`)
- **System format**: Dashed (e.g., `5-02-03-010`) for better frontend manipulation
- Both represent the same account structure

## ✅ DATABASE SCHEMA IMPLEMENTATION

### Final Table Structure
```sql
CREATE TABLE chart_of_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20) UNIQUE NOT NULL,     -- "5-02-03-010"
    account_title VARCHAR(255) NOT NULL,            -- "Office Supplies Expenses"
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    expense_class ENUM('PS', 'MOOE', 'FE', 'CO') NULL, -- NULL for non-expense accounts
    account_series VARCHAR(10) NOT NULL,            -- "5-02" (first 4 characters)
    parent_id BIGINT NULL,                          -- Self-referencing foreign key
    level TINYINT NOT NULL DEFAULT 1,               -- 1=main, 2=sub, 3=detail
    is_postable BOOLEAN DEFAULT TRUE,              -- Can be used in transactions
    is_active BOOLEAN DEFAULT TRUE,
    normal_balance ENUM('DEBIT', 'CREDIT') NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES chart_of_accounts(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);
```

### Key Implementation Decisions
1. **ID-based Hierarchy**: `parent_id` (integer) instead of `parent_number` (string)
2. **Laravel Foreign Keys**: Using `foreignId()->constrained()` pattern
3. **Full COA Support**: All account types, not just expenses
4. **Hierarchical Levels**: 1=main, 2=sub, 3=detail structure

## ✅ FRONTEND IMPLEMENTATION

### Visual Hierarchy Display
```
5-00-00-000  Expenses (Header)
5-01-00-000  Personnel Services (Header)
  ⤷ Salaries and Wages (Header)
    ⤷ Salaries Regular
    ⤷ Salaries Casual
  ⤷ Other Compensation (Header)
    ⤷ PERA
    ⤷ RA
```

### User-Friendly Columns
- **Account Number** - Essential for identification
- **Account Title** - With hierarchy (⤷ + 24px indentation)
- **Expense Class** - PS/MOOE/FE/CO classification
- **Postable** - Yes/No for transaction usage
- **Active** - Status information
- **Description** - Helpful context
- **Updated At** - Last modification
- **Actions** - Copy, View, Edit

### Hidden Technical Columns
- Account Type, Account Series, Parent ID, Normal Balance, Created At

## ✅ MAJOR ACCOUNT CLASSIFICATIONS

### 1. Assets (1xx series)
- **101** - Cash and Cash Equivalents
- **102** - Investments
- **103** - Receivables
- **104** - Inventories
- **105** - Prepaid Expenses
- **106** - Property, Plant and Equipment
- **107** - Investment Property
- **108** - Intangible Assets
- **109** - Biological Assets
- **199** - Other Assets

### 2. Liabilities (2xx series)
- **201** - Payables
- **202** - Provisions
- **203** - Due from/to Government Agencies
- **204** - Deferred Revenue
- **299** - Other Liabilities

### 3. Net Assets/Equity (3xx series)
- **301** - Government Equity
- **302** - Revaluation Surplus
- **303** - Revenue and Expense Summary
- **304** - Equity in Joint Venture

### 4. Revenue (4xx series)
- **401** - Tax Revenue
- **402** - Non-Tax Revenue
- **403** - Other Income
- **405** - Gains
- **406** - Other Non-Operating Income

### 5. Expenses (5xx series) - PRIMARY FOCUS FOR AIP

## ✅ EXPENSE ACCOUNT CLASSIFICATION (5xx series)

### Personnel Services (PS) - 5-01 series
**Account Numbers:** `5-01-XX-XXXX`

**Implemented Key Accounts:**
- `5-01-01-010` - Salaries and Wages-Regular
- `5-01-01-020` - Salaries and Wages-Casual/Contractual
- `5-01-02-010` - Personal Economic Relief Allowance (PERA)
- `5-01-02-020` - Representation Allowance (RA)
- `5-01-02-030` - Transportation Allowance (TA)
- `5-01-02-040` - Clothing/Uniform Allowance
- `5-01-02-050` - Clothing/Uniform Allowance
- `5-01-03-000` - Personnel Benefit Contributions
- `5-01-04-000` - Terminal Leave Benefits

### Maintenance and Other Operating Expenses (MOOE) - 5-02 series
**Account Numbers:** `5-02-XX-XXXX`

#### Travel & Training
- `5-02-01-010` - Traveling Expenses-Local
- `5-02-01-020` - Traveling Expenses-Foreign
- `5-02-02-010` - Training Expenses
- `5-02-02-020` - Scholarship Grants/Expenses

#### Supplies & Materials
- `5-02-03-010` - Office Supplies Expenses
- `5-02-03-020` - Accountable Forms Expenses
- `5-02-03-030` - Non-Accountable Forms Expenses
- `5-02-03-040` - Animal/Zoological Supplies Expenses
- `5-02-03-050` - Food Supplies Expenses
- `5-02-03-060` - Welfare Goods Expenses
- `5-02-03-070` - Drugs and Medicines Expenses
- `5-02-03-080` - Medical, Dental and Laboratory Supplies Expenses
- `5-02-03-090` - Fuel, Oil and Lubricants Expenses

#### Utilities
- `5-02-04-010` - Water Expenses
- `5-02-04-020` - Electricity Expenses
- `5-02-04-030` - Gas/Heating Expenses

#### Communication
- `5-02-05-010` - Postage and Courier Expenses
- `5-02-05-020` - Telephone Expenses (Mobile/Landline)
- `5-02-05-030` - Internet Subscription Expenses

#### Professional Services
- `5-02-11-010` - Legal Services
- `5-02-11-020` - Auditing Services
- `5-02-11-030` - Consultancy Services

#### General Services
- `5-02-12-010` - Environment/Sanitary Services
- `5-02-12-020` - Janitorial Services
- `5-02-12-030` - Security Services

#### Repairs and Maintenance
- `5-02-13-010` - Repairs and Maintenance-Investment Property
- `5-02-13-020` - Repairs and Maintenance-Land Improvements
- `5-02-13-030` - Repairs and Maintenance-Infrastructure Assets
- `5-02-13-040` - Repairs and Maintenance-Buildings and Other Structures
- `5-02-13-050` - Repairs and Maintenance-Machinery and Equipment

### Financial Expenses (FE) - 5-03 series
**Account Numbers:** `5-03-XX-XXXX`

- `5-03-01-010` - Management Supervision/Trusteeship Fees
- `5-03-01-020` - Interest Expenses
- `5-03-01-030` - Guarantee Fees
- `5-03-01-040` - Bank Charges
- `5-03-01-050` - Commitment Fees

### Capital Outlay (CO) - 5-06 series
**Account Numbers:** `5-06-XX-XXXX`

**Note:** Capital Outlay accounts are included but may be treated as asset acquisitions rather than expense accounts.

- `5-06-01-010` - Land
- `5-06-01-020` - Land Improvements
- `5-06-02-010` - Buildings and Other Structures
- `5-06-03-010` - Machinery and Equipment
- `5-06-04-010` - Transportation Equipment
- `5-06-05-010` - Furniture and Fixtures
- `5-06-06-010` - Books
- `5-06-07-010` - Computer Software

## ✅ BACKEND IMPLEMENTATION

### Hierarchical Data Structure
```php
public function index()
{
    $chartOfAccounts = ChartOfAccount::orderBy('level')->orderBy('account_number')->get();
    $hierarchicalAccounts = $this->buildHierarchy($chartOfAccounts);
    
    return Inertia::render('chart-of-accounts/index', [
        'chartOfAccounts' => $hierarchicalAccounts,
    ]);
}

private function buildHierarchy($accounts, $parentId = null)
{
    $tree = [];
    foreach ($accounts as $account) {
        if ($account->parent_id == $parentId) {
            $children = $this->buildHierarchy($accounts, $account->id);
            $accountArray = $account->toArray();
            $accountArray['children'] = $children;
            $tree[] = $accountArray;
        }
    }
    return $tree;
}
```

### Seeder Implementation
- **Two-Phase Seeding**: Create accounts first, then set relationships
- **ID Mapping**: Map account numbers to IDs for parent relationships
- **Official COA Data**: 62+ expense accounts from official source
- **Proper Hierarchy**: Level 1-3 structure maintained

## ✅ TECHNICAL IMPLEMENTATION NOTES

### Format Conversion
```php
// Convert dashed to plain format
$plain_code = str_replace('-', $dashed_code);
// '5-02-03-010' → '50203010'

// Parse account components
$parts = explode('-', '5-02-03-010');
// Returns: ['5', '02', '03', '010']

// Extract account series
$account_series = substr('5-02-03-010', 0, 4);
// Returns: '5-02'
```

### Key Rules Implemented
1. ✅ Only expense accounts (5xx series) have expense_class values
2. ✅ Header/summary accounts have is_postable = false
3. ✅ Account numbers are unique
4. ✅ Parent-child relationships maintain hierarchy via ID references
5. ✅ Dashed format used for system usability
6. ✅ ID-based foreign keys for performance

## ✅ AIP INTEGRATION

The expense accounts directly feed into the AIP Summary Form:
- **Column 8 (PS)** = Sum of all 5-01 series transactions
- **Column 9 (MOOE)** = Sum of all 5-02 series transactions  
- **Column 10 (FE)** = Sum of all 5-03 series transactions
- **Column 11 (CO)** = Sum of all 5-06 series transactions

## ✅ FILES IMPLEMENTED

### Database
- `database/migrations/2026_01_05_120006_create_chart_of_accounts_table.php`
- `database/seeders/ChartOfAccountSeeder.php`

### Frontend
- `resources/js/pages/chart-of-accounts/table/columns.tsx`
- `resources/js/pages/chart-of-accounts/table/data-table.tsx`
- `resources/js/pages/chart-of-accounts/index.tsx`

### Backend
- `app/Http/Controllers/ChartOfAccountController.php`

## References
- COA Circular No. 2015-009 (December 1, 2015)
- BOM 2023 - Table 4 (AIP Summary Form)
- Volume III - The Revised Chart of Accounts (Updated 2015)
- Official Source: `docs/source-of-truth/official/chart of accounts/Volume-III-The-Revised-Chart-of-Accounts-Updated-2015.txt`

---

## ✅ IMPLEMENTATION STATUS

**Status**: ✅ **COMPLETED AND PRODUCTION READY**

**What was implemented:**
- ✅ Full COA database schema with ID-based hierarchy
- ✅ Modern React table with visual hierarchy display
- ✅ Laravel backend with hierarchical data structure
- ✅ Official COA data seeding (62+ expense accounts)
- ✅ User-friendly interface with proper column selection

**Technical achievements:**
- ✅ ID-based foreign key relationships
- ✅ Hierarchical data structure building
- ✅ Modern UI with TanStack Table
- ✅ Clean separation of technical vs user data

**Business value:**
- ✅ Official COA compliance
- ✅ Improved user experience with visual hierarchy
- ✅ Scalable architecture for future enhancements
- ✅ Maintainable and documented codebase

**The Chart of Accounts implementation is now complete and ready for production use!** 🎯
