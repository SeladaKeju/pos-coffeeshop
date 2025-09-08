<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\VariantGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VariantGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $variantGroups = VariantGroup::orderBy('sort_order')
            ->paginate(10);

        return Inertia::render('admin/master-data/menu-variant/variant-manager', [
            'variantGroups' => $variantGroups,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/master-data/menu-variant/form.variant-manager');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:single,multiple',
            'is_required' => 'boolean',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        VariantGroup::create($validated);

        return redirect()->route('admin.variant-groups.index')
            ->with('success', 'Variant group created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VariantGroup $variantGroup)
    {
        return Inertia::render('admin/master-data/menu-variant/form.variant-manager', [
            'variantGroup' => $variantGroup,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VariantGroup $variantGroup)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:single,multiple',
            'is_required' => 'boolean',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $variantGroup->update($validated);

        return redirect()->route('admin.variant-groups.index')
            ->with('success', 'Variant group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VariantGroup $variantGroup)
    {
        $variantGroup->delete();

        return redirect()->route('admin.variant-groups.index')
            ->with('success', 'Variant group deleted successfully.');
    }

    /**
     * Get variant groups for API calls
     */
    public function apiIndex()
    {
        $variantGroups = VariantGroup::with(['activeVariantOptions'])
            ->active()
            ->ordered()
            ->get();

        return response()->json($variantGroups);
    }
}
