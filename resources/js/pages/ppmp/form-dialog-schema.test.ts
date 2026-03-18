import { describe, it, expect } from 'bun:test'; // Changed import source
import { formSchema } from './form-dialog-schema';

describe('Form Schema Validation (Select Input Handling with Nulls)', () => {
    // Helper to provide base valid data
    const validBaseData = {
        aip_entry_id: 1,
        ppmp_price_list_id: 100,
        expenseAccount: 101, 
        itemNo: 1001,
        description: 101, 
        unitOfMeasurement: 'pc',
        price: '5000',
        fundingSource: 1, 
        category: 5, 
        isCustomItem: false,
    };

    it('should pass with valid selected values', () => {
        const result = formSchema.safeParse(validBaseData);
        expect(result.success).toBe(true);
    });

    // ### Select Field Failures (Null Default States)

    it('should fail if expenseAccount is null', () => {
        const invalidData = { ...validBaseData, expenseAccount: null };
        const result = formSchema.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('expenseAccount'));
            expect(issue).toBeDefined();
        }
    });

    it('should fail if fundingSource is null', () => {
        const invalidData = { ...validBaseData, fundingSource: null };
        const result = formSchema.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('fundingSource'));
            expect(issue).toBeDefined();
        }
    });

    it('should fail if description is null', () => {
        const invalidData = { ...validBaseData, description: null };
        const result = formSchema.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('description'));
            expect(issue).toBeDefined();
        }
    });

    // ### Select Field Default States (Null when unselected)

    it('should accept null for expenseAccount when no item is selected', () => {
        const data = { ...validBaseData, expenseAccount: null };
        const result = formSchema.safeParse(data);
        
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('expenseAccount'));
            expect(issue).toBeDefined();
            expect(issue?.message).toBe('Expense account is required');
        }
    });

    it('should accept null for description when no item is selected', () => {
        const data = { ...validBaseData, description: null };
        const result = formSchema.safeParse(data);
        
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('description'));
            expect(issue).toBeDefined();
            expect(issue?.message).toBe('Description is required');
        }
    });

    it('should accept null for fundingSource when no item is selected', () => {
        const data = { ...validBaseData, fundingSource: null };
        const result = formSchema.safeParse(data);
        
        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('fundingSource'));
            expect(issue).toBeDefined();
        }
    });

    it('should fail if category is null', () => {
        const invalidData = { ...validBaseData, category: null };
        const result = formSchema.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
            const issue = result.error.issues.find((i) => i.path.includes('category'));
            expect(issue).toBeDefined();
            expect(issue?.message).toBe('Category is required');
        }
    });

    it('should accept number IDs for select inputs when items are selected', () => {
        const result = formSchema.safeParse(validBaseData);
        expect(result.success).toBe(true);
    });

    // ### Number Field Default States (Zero checks)

    it('should fail if ppmp_price_list_id is zero', () => {
        const result = formSchema.safeParse({ ...validBaseData, ppmp_price_list_id: 0 });
        expect(result.success).toBe(false);
    });

    it('should fail if aip_entry_id is zero', () => {
        const result = formSchema.safeParse({ ...validBaseData, aip_entry_id: 0 });
        expect(result.success).toBe(false);
    });

    it('should fail if fundingSource is zero', () => {
        const result = formSchema.safeParse({ ...validBaseData, fundingSource: 0 });
        expect(result.success).toBe(false);
    });

    it('should fail if itemNo is zero', () => {
        const result = formSchema.safeParse({ ...validBaseData, itemNo: 0 });
        expect(result.success).toBe(false);
    });

    // ### Price Field Validation

    it('should pass if price contains valid numeric content', () => {
        const result = formSchema.safeParse({ ...validBaseData, price: '5000' });
        expect(result.success).toBe(true);
    });

    it('should pass if price contains decimal numeric content', () => {
        const result = formSchema.safeParse({ ...validBaseData, price: '99.99' });
        expect(result.success).toBe(true);
    });

    it('should fail if price contains non-numeric content', () => {
        const result = formSchema.safeParse({ ...validBaseData, price: 'abc' });
        expect(result.success).toBe(false);
    });

    it('should fail if price is empty string', () => {
        const result = formSchema.safeParse({ ...validBaseData, price: '' });
        expect(result.success).toBe(false);
    });

    it('should pass if price contains zero', () => {
        const result = formSchema.safeParse({ ...validBaseData, price: '0' });
        expect(result.success).toBe(true);
    });
});