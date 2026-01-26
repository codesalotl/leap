# PPMP Implementation Plan
## Project Procurement Management Plan

### 🎯 Overview
Implementation plan for PPMP with price list integration into AIP system.

### 📋 Current System Status
- ✅ AIP Budget Planning (80% complete)
- ✅ MOOE Itemization (fully implemented)
- ✅ Chart of Accounts integration
- ❌ PPMP Module (not yet implemented)
- ❌ PPMP Price List (not yet implemented)

---

## 🔄 Integration Architecture

### Data Flow (BOM-Compliant)
```
PPMP Price List → MOOE Itemization → PPMP Creation
       ↓               ↓                ↓
  Standard Unit    Quantity Input    Procurement
  Prices &         with Auto-        Planning
  Item Catalog     Calculation
```

### Key Integration Points
1. **PPMP Price List → MOOE Dialog**: Provide standardized unit prices
2. **MOOE Items → PPMP Trigger**: Flag procurement-needy items
3. **Quantity × Price → Budget Data**: Auto-calculate amounts

---

## 🏗️ Phase 1: Database Schema

### New Tables

#### 1. `ppmp_price_list`
```sql
CREATE TABLE ppmp_price_list (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_description TEXT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    expense_class ENUM('PS', 'MOOE', 'FE', 'CO') NOT NULL,
    account_code VARCHAR(20) NOT NULL,
    procurement_type ENUM('Goods', 'Services', 'Civil Works', 'Consulting') NOT NULL,
    standard_specifications TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_item_code (item_code),
    INDEX idx_account_code (account_code),
    INDEX idx_expense_class (expense_class)
);
```

#### 2. `ppmp_headers`
```sql
CREATE TABLE ppmp_headers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    aip_entry_id BIGINT NOT NULL,
    office_id BIGINT NOT NULL,
    procurement_type ENUM('Goods', 'Services', 'Civil Works', 'Consulting') NOT NULL,
    procurement_method ENUM('Public Bidding', 'Direct Purchase', 'Shopping', 'Limited Source Bidding', 'Negotiated Procurement') NOT NULL,
    implementation_schedule DATE,
    source_of_funds VARCHAR(255),
    approved_budget DECIMAL(15,2) NOT NULL,
    status ENUM('Draft', 'Submitted', 'Approved', 'Rejected') DEFAULT 'Draft',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (aip_entry_id) REFERENCES aip_entries(id),
    FOREIGN KEY (office_id) REFERENCES offices(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Modified Tables

#### `ppa_itemized_costs`
```sql
ALTER TABLE ppa_itemized_costs 
ADD COLUMN ppmp_price_list_id BIGINT NULL,
ADD COLUMN quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
ADD COLUMN unit_price DECIMAL(10,2) GENERATED ALWAYS AS (amount / quantity) STORED,
ADD COLUMN requires_procurement BOOLEAN DEFAULT FALSE,
ADD COLUMN ppmp_header_id BIGINT NULL,
ADD FOREIGN KEY (ppmp_price_list_id) REFERENCES ppmp_price_list(id),
ADD FOREIGN KEY (ppmp_header_id) REFERENCES ppmp_headers(id);
```

---

## 🎨 Phase 2: Frontend Components

### 2.1 PPMP Price List Management
**File**: `resources/js/pages/ppmp/price-list.tsx`

Features:
- Master catalog of all procurable items
- Standard unit prices and specifications
- Search and filter by expense class/account code
- CRUD operations for price list items

### 2.2 MOOE Dialog Enhancement (BOM-Compliant)
**File**: `resources/js/pages/aip/mooe-dialog.tsx`

**Key Changes:**
- Remove direct amount input
- Add PPMP price list selection
- Add quantity input with auto-calculation
- Display unit price from PPMP catalog

```typescript
interface ItemizedCost {
  account_code: string;
  ppmp_price_list_id?: number;
  item_description: string;
  quantity: number;
  unit_price: number; // From PPMP price list
  amount: number; // Auto-calculated: quantity × unit_price
  requires_procurement: boolean;
}

// PPMP Item Selection
<Select onValueChange={(value) => selectPpmpItem(value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select item from PPMP catalog" />
  </SelectTrigger>
  <SelectContent>
    {ppmpItems.map(item => (
      <SelectItem key={item.id} value={item.id.toString()}>
        {item.item_description} - ₱{item.unit_price}/{item.unit}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// Quantity Input with Auto-Calculation
<Input
  type="number"
  value={item.quantity}
  onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
  placeholder="Quantity"
/>
<span className="text-sm text-muted-foreground">
  {item.quantity} × ₱{item.unit_price} = ₱{item.quantity * item.unit_price}
</span>
```

---

## 🔧 Phase 3: Backend Implementation

### 3.1 Models

#### `app/Models/PpmpPriceList.php`
```php
class PpmpPriceList extends Model
{
    protected $fillable = [
        'item_code', 'item_description', 'unit', 'unit_price',
        'expense_class', 'account_code', 'procurement_type', 'standard_specifications'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2'
    ];

    public function itemizedCosts()
    {
        return $this->hasMany(PpaItemizedCost::class, 'ppmp_price_list_id');
    }

    public function scopeByExpenseClass($query, $expenseClass)
    {
        return $query->where('expense_class', $expenseClass);
    }

    public function scopeByAccountCode($query, $accountCode)
    {
        return $query->where('account_code', $accountCode);
    }
}
```

#### `app/Models/PpmpHeader.php`
```php
class PpmpHeader extends Model
{
    protected $fillable = [
        'aip_entry_id', 'office_id', 'procurement_type', 
        'procurement_method', 'implementation_schedule',
        'source_of_funds', 'approved_budget', 'status', 'created_by'
    ];

    public function aipEntry()
    {
        return $this->belongsTo(AipEntry::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
```

### 3.2 Controllers

#### `app/Http/Controllers/PpmpPriceListController.php`
```php
class PpmpPriceListController extends Controller
{
    public function index()
    {
        $priceList = PpmpPriceList::orderBy('item_description')->get();
        return Inertia::render('ppmp/price-list', ['priceList' => $priceList]);
    }

    public function store(StorePpmpPriceListRequest $request)
    {
        PpmpPriceList::create($request->validated());
        return redirect()->back()->with('success', 'Price list item added');
    }

    public function update(UpdatePpmpPriceListRequest $request, PpmpPriceList $priceListItem)
    {
        $priceListItem->update($request->validated());
        return redirect()->back()->with('success', 'Price list item updated');
    }
}
```

---

## 🔗 Phase 4: Integration with MOOE

### 4.1 MOOE Dialog Enhancement (BOM-Compliant)
**File**: `resources/js/pages/aip/mooe-dialog.tsx`

**Key Changes:**
- Remove direct amount input
- Add PPMP price list selection
- Add quantity input with auto-calculation
- Display unit price from PPMP catalog

```typescript
interface ItemizedCost {
  account_code: string;
  ppmp_price_list_id?: number;
  item_description: string;
  quantity: number;
  unit_price: number; // From PPMP price list
  amount: number; // Auto-calculated: quantity × unit_price
  requires_procurement: boolean;
  ppmp_status?: 'none' | 'draft' | 'submitted' | 'approved';
}

// PPMP Item Selection
<Select onValueChange={(value) => selectPpmpItem(value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select item from PPMP catalog" />
  </SelectTrigger>
  <SelectContent>
    {ppmpItems.map(item => (
      <SelectItem key={item.id} value={item.id.toString()}>
        {item.item_description} - ₱{item.unit_price}/{item.unit}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// Quantity Input with Auto-Calculation
<Input
  type="number"
  value={item.quantity}
  onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
  placeholder="Quantity"
/>
<span className="text-sm text-muted-foreground">
  {item.quantity} × ₱{item.unit_price} = ₱{item.quantity * item.unit_price}
</span>
```

### 4.2 PPMP Price List Integration
```typescript
// Fetch PPMP items for MOOE dialog
const { data: ppmpItems } = useQuery({
  queryKey: ['ppmp-price-list', selectedAccountCode],
  queryFn: () => axios.get(`/api/ppmp/price-list?account_code=${selectedAccountCode}`)
});

// Auto-calculate amount when quantity changes
const updateQuantity = (itemId, quantity) => {
  const item = items.find(i => i.id === itemId);
  const newAmount = quantity * item.unit_price;
  updateItem(itemId, { quantity, amount: newAmount });
};
```

### 4.3 PPMP Creation Trigger
```typescript
// Enhanced PPMP creation with pre-filled data
{item.requires_procurement && (
  <Button 
    onClick={() => createPpmpFromMooeItem(item)}
    variant={item.ppmp_status ? 'secondary' : 'default'}
  >
    {item.ppmp_status ? `View PPMP (${item.ppmp_status})` : 'Create PPMP'}
  </Button>
)}

const createPpmpFromMooeItem = (mooeItem) => {
  return {
    aip_entry_id: mooeItem.aip_entry_id,
    procurement_type: mooeItem.ppmp_item.procurement_type,
    source_of_funds: `MOOE - ${mooeItem.account_code}`,
    approved_budget: mooeItem.amount,
    items: [{
      item_description: mooeItem.item_description,
      quantity: mooeItem.quantity,
      unit_cost: mooeItem.unit_price,
      total_cost: mooeItem.amount,
      specifications: mooeItem.ppmp_item.standard_specifications
    }]
  };
};
```

---

## 📋 Implementation Notes

### Budget Validation Rules
- MOOE amount = quantity × unit_price (from PPMP price list)
- PPMP budget cannot exceed calculated MOOE amount
- Source of funds must match expense class

### Procurement Method Thresholds
- Public Bidding: > ₱5,000,000
- Direct Purchase: ₱500,000 - ₱5,000,000
- Shopping: ≤ ₱500,000

### User Permissions
- **Admin**: Manage PPMP price list, view all PPMPs
- **Department Heads**: Create MOOE items, create PPMPs
- **BAC**: Review and approve PPMPs
- **Procurement Officers**: Execute PPMPs

---

## 📊 PPMP Report Format

### PPMP Spreadsheet Report
**File**: `resources/js/pages/ppmp/ppmp-report.tsx`

**Report Columns:**
| Column | Description |
|--------|-------------|
| **Expense Account** | Chart of Accounts code (e.g., "501001") |
| **Item No** | PPMP price list item code |
| **Description** | Item description |
| **Unit of Measurement** | Unit (e.g., "pcs", "box", "set") |
| **Price List** | Unit price from PPMP price list |
| **CY 2025-Qty** | Total quantity for fiscal year |
| **Total** | Total amount (CY 2025-Qty × Price List) |
| **Jan-Qty** | January quantity |
| **Jan** | January amount (Jan-Qty × Price List) |
| **Feb-Qty** | February quantity |
| **Feb** | February amount (Feb-Qty × Price List) |
| **...** | Continue through December |
| **Dec-Qty** | December quantity |
| **Dec** | December amount (Dec-Qty × Price List) |

### Report Features:
- **Monthly Breakdown**: Each month has quantity and amount columns
- **Annual Summary**: CY 2025-Qty and Total columns for yearly totals
- **Excel Export**: Download as Excel spreadsheet with formulas
- **PDF Export**: Printable format with proper formatting
- **Filtering**: By expense class, office, procurement type
- **Validation**: Monthly quantities sum to annual total

### Sample Report Structure:
```typescript
interface PpmpReportItem {
  expense_account: string;
  item_no: string;
  description: string;
  unit_of_measurement: string;
  price_list: number;
  cy_2025_qty: number;
  total: number;
  jan_qty: number;
  jan: number;
  feb_qty: number;
  feb: number;
  // ... continue through dec_qty and dec
}
```

### Implementation Notes:
- **Monthly Distribution**: Users can distribute annual quantity across months
- **Auto-Calculation**: Monthly amounts = monthly quantity × unit price
- **Validation**: Sum of monthly quantities must equal annual quantity
- **Flexible**: Can be adapted for different fiscal years
