<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\VariantOption;
use App\Models\VariantGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VariantOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $query = VariantGroup::orderBy('sort_order');
        
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }
        
        $variantGroups = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/master-data/option-variant/option-manager', [
            'variantGroups' => $variantGroups,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display variant options for a specific group.
     */
    public function manage(Request $request, VariantGroup $variantGroup)
    {
        $search = $request->get('search');
        
        $query = VariantOption::where('variant_group_id', $variantGroup->id)
            ->orderBy('sort_order');
            
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }
        
        $variantOptions = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/master-data/option-variant/option-details', [
            'variantGroup' => $variantGroup,
            'variantOptions' => $variantOptions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $variantGroups = VariantGroup::active()->ordered()->get();
        $variantGroup = null;
        
        // If coming from specific variant group page
        if ($request->has('variant_group_id')) {
            $variantGroup = VariantGroup::find($request->get('variant_group_id'));
        }

        return Inertia::render('admin/master-data/option-variant/form.option-manager', [
            'variantGroups' => $variantGroups,
            'variantGroup' => $variantGroup,
        ]);
    }

        /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'variant_group_id' => 'required|exists:variant_groups,id',
            'name' => 'required|string|max:255',
            'extra_price' => 'required|numeric|min:0',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $variantOption = VariantOption::create($validated);
        $variantGroup = VariantGroup::find($validated['variant_group_id']);

        return redirect()->route('admin.variant-options.manage', $variantGroup)
            ->with('success', 'Variant option created successfully.');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VariantOption $variantOption)
    {
        $variantGroups = VariantGroup::active()->ordered()->get();
        $variantOption->load(['variantGroup']);

        return Inertia::render('admin/master-data/option-variant/form.option-manager', [
            'variantGroups' => $variantGroups,
            'variantGroup' => $variantOption->variantGroup,
            'variantOption' => $variantOption,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VariantOption $variantOption)
    {
        $validated = $request->validate([
            'variant_group_id' => 'required|exists:variant_groups,id',
            'name' => 'required|string|max:255',
            'extra_price' => 'required|integer|min:0',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $variantOption->update($validated);
        $variantGroup = VariantGroup::find($validated['variant_group_id']);

        return redirect()->route('admin.variant-options.manage', $variantGroup)
            ->with('success', 'Variant option updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VariantOption $variantOption)
    {
        $groupId = $variantOption->variant_group_id;
        $variantOption->delete();

        return redirect()->route('admin.variant-options.manage', $groupId)
            ->with('success', 'Variant option deleted successfully.');
    }
}
