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
        $variantGroups = VariantGroup::orderBy('sort_order')
            ->paginate(10);

        return Inertia::render('admin/master-data/option-variant/option-manager', [
            'variantGroups' => $variantGroups,
        ]);
    }

    /**
     * Display variant options for a specific group.
     */
    public function manage(VariantGroup $variantGroup)
    {
        $variantOptions = VariantOption::where('variant_group_id', $variantGroup->id)
            ->orderBy('sort_order')
            ->paginate(10);

        return Inertia::render('admin/master-data/option-variant/option-details', [
            'variantGroup' => $variantGroup,
            'variantOptions' => $variantOptions,
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
            $variantGroup = VariantGroup::find($request->variant_group_id);
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
            'extra_price' => 'required|numeric',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        VariantOption::create($validated);

        return redirect()->route('admin.variant-options.manage')
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
            'variantOption' => $variantOption,
            'variantGroups' => $variantGroups,
            'variantGroup' => $variantOption->variantGroup,
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
            'extra_price' => 'required|numeric',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $variantOption->update($validated);

        return redirect()->route('admin.variant-options.manage')
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
