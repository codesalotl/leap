import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PpmpHeaderFormDialog from './form-dialog';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPMP Headers',
        href: '/ppmp-headers',
    },
];

type PpmpHeader = {
    id: number;
    aip_entry_id: number;
    office_id: number;
    procurement_type: 'Goods' | 'Services' | 'Civil Works' | 'Consulting';
    procurement_method: 'Public Bidding' | 'Direct Purchase' | 'Shopping' | 'Limited Source Bidding' | 'Negotiated Procurement';
    implementation_schedule: string | null;
    source_of_funds: string | null;
    approved_budget: string;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    created_at: string;
    updated_at: string;
    aip_entry?: {
        id: number;
        expected_output: string;
    };
    office?: {
        id: number;
        name: string;
    };
    created_by?: {
        id: number;
        name: string;
    };
};

type PpmpHeadersPageProps = {
    ppmpHeaders: PpmpHeader[];
    aipEntries: any[];
    offices: any[];
};

export default function PpmpHeadersPage({
    ppmpHeaders,
    aipEntries = [],
    offices = [],
}: PpmpHeadersPageProps) {
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PpmpHeader | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const handleCreate = () => {
        setEditingItem(null);
        setMode('create');
        setOpen(true);
    };

    const handleEdit = (item: PpmpHeader) => {
        setEditingItem(item);
        setMode('edit');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
        setMode('create');
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft':
                return 'bg-gray-100 text-gray-800';
            case 'Submitted':
                return 'bg-blue-100 text-blue-800';
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProcurementTypeColor = (type: string) => {
        switch (type) {
            case 'Goods':
                return 'bg-purple-100 text-purple-800';
            case 'Services':
                return 'bg-orange-100 text-orange-800';
            case 'Civil Works':
                return 'bg-yellow-100 text-yellow-800';
            case 'Consulting':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">PPMP Headers</h1>
                        <p className="text-muted-foreground">
                            Manage Project Procurement Management Plans
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        Create PPMP Header
                    </Button>
                </div>

                {ppmpHeaders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <h3 className="text-lg font-semibold mb-2">No PPMP Headers Found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Get started by creating your first PPMP Header.
                            </p>
                            <Button onClick={handleCreate}>Create PPMP Header</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {ppmpHeaders.map((header) => (
                            <Card key={header.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">
                                                PPMP #{header.id.toString().padStart(4, '0')}
                                            </CardTitle>
                                            <CardDescription>
                                                {header.office?.name || 'Unknown Office'}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className={getStatusColor(header.status)}>
                                                {header.status}
                                            </Badge>
                                            <Badge className={getProcurementTypeColor(header.procurement_type)}>
                                                {header.procurement_type}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">AIP Entry</p>
                                            <p className="font-semibold">
                                                {header.aip_entry?.expected_output || 'Unknown AIP Entry'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Procurement Method</p>
                                            <p className="font-semibold">{header.procurement_method}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Approved Budget</p>
                                            <p className="font-semibold">₱{parseFloat(header.approved_budget).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Implementation Schedule</p>
                                            <p className="font-semibold">
                                                {header.implementation_schedule 
                                                    ? new Date(header.implementation_schedule).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })
                                                    : 'Not set'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Source of Funds</p>
                                            <p className="font-semibold">
                                                {header.source_of_funds || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Created</p>
                                            <p className="font-semibold">
                                                {new Date(header.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/ppmp-headers/${header.id}/items`)}
                                        >
                                            View Items
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(header)}>
                                            Edit
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <PpmpHeaderFormDialog 
                    open={open} 
                    onOpenChange={handleClose} 
                    aipEntries={aipEntries}
                    offices={offices}
                    editingItem={editingItem}
                    mode={mode}
                />
            </div>
        </AppLayout>
    );
}
