# AIP-MOOE-PPMP Implementation Plan

## Overview
This implementation plan outlines the development of a comprehensive budgeting and procurement management system that integrates Annual Investment Program (AIP), Maintenance and Other Operating Expenses (MOOE) breakdown, and Procurement Plan Management Process (PPMP) based on the BOM 2023 manual requirements.

## System Architecture

### Core Modules
1. **AIP Management Module**
2. **MOOE Breakdown Module** 
3. **PPMP Generation Module**
4. **Procurement Tracking Module**
5. **Reporting & Analytics Module**

## Implementation Phases

### **Phase 1: Foundation & Unified Modal (Weeks 1-4)**

#### Week 1: Database Setup
- [ ] Create unified `mooe_ppmp_items` table
- [ ] Create `mooe_expense_accounts` table (optional grouping)
- [ ] Update AIP entries table for unified integration
- [ ] Set up relationships and constraints
- [ ] Create seeders for initial data

#### Week 2: Unified Modal Foundation
- [ ] Create `UnifiedMOOEPPMPModal.tsx` component
- [ ] Implement expense account selector
- [ ] Create item input field with dropdown + text input
- [ ] Basic CRUD operations for items and accounts

#### Week 3: Smart Input Features
- [ ] Dropdown integration with PPMP price list
- [ ] Text input for custom item descriptions
- [ ] Real-time cost calculations
- [ ] Standalone item support (no expense account required)

#### Week 4: Integration & Testing
- [ ] Integration with AIP entries
- [ ] Save all functionality
- [ ] Modal state management
- [ ] Basic validation and error handling

### **Phase 2: Advanced Features & Workflow (Weeks 5-8)**

#### Week 5: Advanced Item Management
- [ ] Bulk item operations (add, edit, delete)
- [ ] Item templates and presets
- [ ] Drag-and-drop reordering
- [ ] Copy items between expense accounts

#### Week 6: PPMP Integration
- [ ] Auto-generate PPMP from unified items
- [ ] Quarterly scheduling interface
- [ ] Procurement method determination
- [ ] PPMP status tracking

#### Week 7: User Experience Enhancements
- [ ] Keyboard shortcuts and navigation
- [ ] Advanced search and filtering
- [ ] Item categorization and tagging
- [ ] Undo/redo functionality

#### Week 8: Testing & Optimization
- [ ] Performance optimization for large datasets
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] User acceptance testing

### **Phase 3: Analytics & Reporting (Weeks 9-12)**

#### Week 9: Dashboard Development
- [ ] Unified MOOE/PPMP dashboard
- [ ] Real-time cost tracking
- [ ] Item categorization analytics
- [ ] Budget utilization reports

#### Week 10: Advanced Analytics
- [ ] Item cost trends and forecasting
- [ ] Expense account analysis
- [ ] PPMP efficiency metrics
- [ ] Custom report builder

#### Week 11: Integration & APIs
- [ ] REST API for unified data
- [ ] Export functionality (Excel, PDF)
- [ ] Third-party system integration
- [ ] Webhook notifications

#### Week 12: Final Testing & Deployment
- [ ] Comprehensive system testing
- [ ] Security audit and validation
- [ ] Performance testing
- [ ] Production deployment

### **Phase 4: Optimization & Support (Weeks 13-16)**

#### Week 13-14: Performance Optimization
- [ ] Database query optimization
- [ ] Frontend performance tuning
- [ ] Caching implementation
- [ ] Load testing

#### Week 15-16: Documentation & Training
- [ ] User documentation and guides
- [ ] Admin training materials
- [ ] Video tutorials
- [ ] Post-launch support plan

## Technical Specifications

### Database Schema

#### AIP Entries Table
```sql
CREATE TABLE aip_entries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ppa_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    implementing_office VARCHAR(100) NOT NULL,
    ps_amount DECIMAL(15,2) DEFAULT 0,
    mooe_amount DECIMAL(15,2) DEFAULT 0,
    fe_amount DECIMAL(15,2) DEFAULT 0,
    co_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (ps_amount + mooe_amount + fe_amount + co_amount) STORED,
    status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
    fiscal_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Unified MOOE/PPMP Items Table
```sql
CREATE TABLE mooe_ppmp_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    aip_entry_id BIGINT NOT NULL,
    expense_account_id BIGINT NULL, -- Can be null for standalone items
    item_description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    total_cost DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    ppmp_price_list_id BIGINT NULL, -- Reference to PPMP catalog
    specifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aip_entry_id) REFERENCES aip_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_account_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (ppmp_price_list_id) REFERENCES ppmp_price_list(id) ON DELETE SET NULL
);
```

#### Expense Accounts Table (Optional grouping)
```sql
CREATE TABLE mooe_expense_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    aip_entry_id BIGINT NOT NULL,
    chart_of_account_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aip_entry_id) REFERENCES aip_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (chart_of_account_id) REFERENCES chart_of_accounts(id) ON DELETE CASCADE
);
```

#### PPMP Table
```sql
CREATE TABLE ppmps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ppmp_code VARCHAR(50) UNIQUE NOT NULL,
    aip_entry_id BIGINT NOT NULL,
    office VARCHAR(100) NOT NULL,
    total_budget DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'ongoing', 'completed', 'delayed') DEFAULT 'pending',
    fiscal_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aip_entry_id) REFERENCES aip_entries(id) ON DELETE CASCADE
);
```

#### PPMP Items Table
```sql
CREATE TABLE ppmp_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ppmp_id BIGINT NOT NULL,
    mooe_item_id BIGINT,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    estimated_cost DECIMAL(15,2) NOT NULL,
    procurement_method ENUM('shopping', 'small_value', 'competitive', 'public_bidding', 'direct_contracting') NOT NULL,
    quarter ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
    status ENUM('pending', 'procured', 'delivered', 'cancelled') DEFAULT 'pending',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ppmp_id) REFERENCES ppmps(id) ON DELETE CASCADE,
    FOREIGN KEY (mooe_item_id) REFERENCES mooe_items(id) ON DELETE SET NULL
);
```

## User Workflow & Requirements

### **Core Workflow**
1. **AIP Table** → Click MOOE button
2. **Unified MOOE/PPMP Modal** → Opens directly showing PPMP interface
3. **Add Expense Accounts** → Select from standard MOOE categories
4. **Add Items** → Can be added under expense accounts OR as standalone items
5. **Save** → All changes saved to AIP entry

### **Key Requirements**
- ✅ **Unified Interface**: Single modal handles both MOOE and PPMP
- ✅ **Flexible Item Management**: Items can be added with or without expense account association
- ✅ **No Budget Limits**: No per-expense-account budget restrictions
- ✅ **Smart Input Fields**: Text input + dropdown for item selection
- ✅ **Direct PPMP Access**: MOOE modal opens directly as PPMP interface

### **Unified MOOE/PPMP Modal Structure**
```
┌─────────────────────────────────────────────────────────┐
│ MOOE & PPMP Management - Health Services Enhancement      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Left Panel: Expense Accounts        │ Right Panel: Items │
│ ┌─────────────────────────────────┐ │ ┌───────────────┐ │
│ │ Travel Expenses                 │ │ │ Item Details  │ │
│ │ ├─ [Dropdown+Text] Airfare     │ │ │ Description:  │ │
│ │ ├─ [Dropdown+Text] Hotel        │ │ │ [Text Input]  │ │
│ │ └─ [+ Add Item]                │ │ │ Or Select:    │ │
│ └─────────────────────────────────┘ │ │ [Dropdown]    │ │
│                                   │ │ Quantity:     │ │
│ Office Supplies                   │ │ [Input]       │ │
│ ├─ [Dropdown+Text] Paper          │ │ Unit Cost:    │ │
│ └─ [+ Add Item]                  │ │ [Input]       │ │
│                                   │ │ Total: ₱X     │ │
│ [+ Add Expense Account]           │ │ [Save Item]   │ │
│                                   │ └───────────────┘ │
│ Standalone Items (No Account)     │                   │
│ ├─ [Dropdown+Text] Equipment      │                   │
│ └─ [+ Add Item]                  │                   │
├─────────────────────────────────────────────────────────┤
│ Total MOOE Items: X items | Total Cost: ₱XXX           │
│ [Save All] [Cancel]                                   │
└─────────────────────────────────────────────────────────┘
```

### **Frontend Components**

#### AIP Management Components
```
components/
├── aip/
│   ├── AIPTable.tsx
│   ├── UnifiedMOOEPPMPModal.tsx
│   └── AIPActions.tsx
├── mooe/
│   ├── ExpenseAccountSelector.tsx
│   ├── ItemInputField.tsx
│   └── ItemList.tsx
├── ppmp/
│   ├── PPMPDashboard.tsx
│   └── PPMPStatusTracker.tsx
└── shared/
    ├── Modal.tsx
    ├── DataTable.tsx
    └── BudgetCalculator.tsx
```

### API Endpoints

#### AIP Management
```
GET    /api/aip                    - List all AIP entries
GET    /api/aip/{id}               - Get specific AIP entry
POST   /api/aip                    - Create new AIP entry
PUT    /api/aip/{id}               - Update AIP entry
DELETE /api/aip/{id}               - Delete AIP entry
POST   /api/aip/{id}/submit        - Submit AIP for approval
POST   /api/aip/{id}/approve       - Approve AIP entry
```

#### MOOE Management
```
GET    /api/aip/{id}/mooe-ppmp          - Get unified MOOE/PPMP data
POST   /api/aip/{id}/mooe-ppmp          - Save unified MOOE/PPMP data
PUT    /api/aip/{id}/mooe-ppmp/items/{itemId}  - Update item
DELETE /api/aip/{id}/mooe-ppmp/items/{itemId}  - Delete item
POST   /api/aip/{id}/mooe-ppmp/accounts     - Add expense account
DELETE /api/aip/{id}/mooe-ppmp/accounts/{accountId} - Delete expense account
```

#### PPMP Management
```
GET    /api/ppmp                   - List all PPMPs
GET    /api/ppmp/{id}              - Get specific PPMP
POST   /api/ppmp/generate          - Generate PPMP from AIP
PUT    /api/ppmp/{id}              - Update PPMP
GET    /api/ppmp/{id}/items        - Get PPMP items
POST   /api/ppmp/{id}/items        - Add PPMP item
PUT    /api/ppmp/items/{id}        - Update PPMP item
DELETE /api/ppmp/items/{id}        - Delete PPMP item
```

## User Roles & Permissions

### System Roles
1. **Department Head**
   - Create AIP entries
   - Manage MOOE breakdown
   - Generate and manage PPMP
   - View department reports

2. **Budget Officer**
   - Review and approve AIP entries
   - Monitor budget allocations
   - Generate budget reports
   - System administration

3. **Procurement Officer**
   - Review PPMP items
   - Update procurement status
   - Generate procurement reports
   - Manage vendor information

4. **Sanggunian Member**
   - View approved AIP entries
   - Generate legislative reports
   - Monitor budget utilization

5. **System Administrator**
   - User management
   - System configuration
   - Backup and maintenance
   - Technical support

## Compliance Requirements

### Government Standards
- **BOM 2023 Manual**: Budgeting and procurement guidelines
- **RA 9184**: Government procurement reform act
- **COA Circulars**: Audit and accounting standards
- **DBM Circulars**: Budget utilization guidelines

### Data Validation Rules
- MOOE amounts must be positive numbers
- PPMP items cannot exceed MOOE budget allocation
- Procurement method must follow amount thresholds
- Quarterly scheduling must consider procurement lead time

### Audit Trail
- All CRUD operations must be logged
- User actions must be traceable
- Budget changes must be documented
- Approval workflows must be recorded

## Testing Strategy

### Unit Testing
- [ ] Model validation tests
- [ ] API endpoint tests
- [ ] Component rendering tests
- [ ] Business logic tests

### Integration Testing
- [ ] AIP to MOOE integration
- [ ] MOOE to PPMP generation
- [ ] Budget calculation accuracy
- [ ] Data consistency checks

### User Acceptance Testing
- [ ] Department workflow testing
- [ ] Budget officer approval process
- [ ] Procurement officer operations
- [ ] Report generation accuracy

### Performance Testing
- [ ] Load testing for concurrent users
- [ ] Database query optimization
- [ ] Report generation performance
- [ ] Mobile responsiveness testing

## Deployment Plan

### Development Environment
- Local development setup
- Version control with Git
- Automated testing pipeline
- Code review process

### Staging Environment
- Production-like setup
- User acceptance testing
- Performance testing
- Security validation

### Production Deployment
- Database migration
- Application deployment
- Configuration setup
- User training
- Go-live support

## Risk Mitigation

### Technical Risks
- **Data Loss**: Regular backups and recovery procedures
- **Performance**: Database optimization and caching
- **Security**: Authentication and authorization controls
- **Integration**: API versioning and backward compatibility

### Business Risks
- **User Adoption**: Comprehensive training and support
- **Compliance**: Regular audits and validation
- **Budget Overruns**: Strict budget controls and alerts
- **Timeline Delays**: Agile methodology and regular monitoring

## Success Metrics

### System Performance
- Response time < 2 seconds for all operations
- 99.9% system uptime
- Support for 100+ concurrent users
- Mobile-friendly interface

### Business Impact
- 50% reduction in budget preparation time
- 90% accuracy in budget calculations
- 100% compliance with government regulations
- Improved transparency and accountability

## Post-Implementation Support

### Training Programs
- Department head training (2 days)
- Budget officer training (3 days)
- Procurement officer training (2 days)
- System administrator training (1 week)

### Documentation
- User manuals for each role
- Technical documentation
- API documentation
- Troubleshooting guides

### Maintenance Plan
- Regular system updates
- Security patches
- Performance monitoring
- User feedback collection

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | Weeks 1-4 | AIP core functionality, basic MOOE |
| Phase 2 | Weeks 5-8 | Complete MOOE item management, PPMP generation |
| Phase 3 | Weeks 9-12 | Procurement workflow, user management |
| Phase 4 | Weeks 13-16 | Analytics, reporting, deployment |

**Total Implementation Time: 16 weeks (4 months)**

---

*This implementation plan provides a comprehensive roadmap for developing a fully integrated AIP-MOOE-PPMP system that complies with government regulations and meets the needs of local government units.*
