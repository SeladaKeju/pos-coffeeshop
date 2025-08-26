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
        $query = VariantOption::with(['variantGroup']);

        // Filter by variant group if provided
        if ($request->has('variant_group_id')) {
            $query->where('variant_group_id', $request->variant_group_id);
        }

        $variantOptions = $query->orderBy('sort_order')->paginate(10);
        $variantGroups = VariantGroup::active()->ordered()->get();

        return Inertia::render('admin/master-data/variant-option/variant-option-manager', [
            'variantOptions' => $variantOptions,
            'variantGroups' => $variantGroups,
            'filters' => $request->only(['variant_group_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $variantGroups = VariantGroup::active()->ordered()->get();

        return Inertia::render('admin/master-data/variant-option/create-variant-option', [
            'variantGroups' => $variantGroups,
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

        return redirect()->route('admin.variant-options.index')
            ->with('success', 'Variant option created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(VariantOption $variantOption)
    {
        $variantOption->load(['variantGroup']);

        return Inertia::render('admin/master-data/variant-option/show-variant-option', [
            'variantOption' => $variantOption,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VariantOption $variantOption)
    {
        $variantGroups = VariantGroup::active()->ordered()->get();
        $variantOption->load(['variantGroup']);

        return Inertia::render('admin/master-data/variant-option/edit-variant-option', [
            'variantOption' => $variantOption,
            'variantGroups' => $variantGroups,
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

        return redirect()->route('admin.variant-options.index')
            ->with('success', 'Variant option updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VariantOption $variantOption)
    {
        $variantOption->delete();

        return redirect()->route('admin.variant-options.index')
            ->with('success', 'Variant option deleted successfully.');
    }

    /**
     * Get variant options by group for API calls
     */
    public function getByGroup(VariantGroup $variantGroup)
    {
        $options = $variantGroup->activeVariantOptions;

        return response()->json($options);
    }
}
