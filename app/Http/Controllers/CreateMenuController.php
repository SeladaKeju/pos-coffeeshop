<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use App\Models\Category;
use App\Models\VariantGroup;
use Inertia\Inertia;

class CreateMenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $category = $request->get('category');
        $station = $request->get('station');
        
        $query = Menu::with(['category'])
            ->orderBy('name');
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('sku', 'like', '%' . $search . '%');
            });
        }
        
        if ($category) {
            $query->where('category_id', $category);
        }
        
        if ($station) {
            $query->where('station', $station);
        }
        
        $menus = $query->paginate(10)->withQueryString();
        $categories = Category::orderBy('sort')->get();

        return Inertia::render('admin/menu/create-menu', [
            'menus' => $menus,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'station' => $station,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::orderBy('sort')->get();
        $variantGroups = VariantGroup::where('is_active', true)->orderBy('sort_order')->get();
        
        return Inertia::render('admin/master-data/menu/form.menu-manager', [
            'categories' => $categories,
            'variantGroups' => $variantGroups,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:menus',
            'price' => 'required|numeric|min:0',
            'station' => 'required|in:kitchen,bar,both',
            'is_active' => 'boolean',
            'variant_groups' => 'array',
            'variant_groups.*' => 'exists:variant_groups,id',
        ]);

        $menu = Menu::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'price' => $validated['price'],
            'station' => $validated['station'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Attach variant groups if provided
        if (isset($validated['variant_groups'])) {
            $menu->variantGroups()->attach($validated['variant_groups']);
        }

        return redirect()->route('admin.create-menu.index')
            ->with('success', 'Menu created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        $categories = Category::orderBy('sort')->get();
        $variantGroups = VariantGroup::where('is_active', true)->orderBy('sort_order')->get();
        $menu->load(['category', 'variantGroups']);

        return Inertia::render('admin/master-data/menu/form.menu-manager', [
            'categories' => $categories,
            'variantGroups' => $variantGroups,
            'menu' => $menu,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:menus,sku,' . $menu->id,
            'price' => 'required|numeric|min:0',
            'station' => 'required|in:kitchen,bar,both',
            'is_active' => 'boolean',
            'variant_groups' => 'array',
            'variant_groups.*' => 'exists:variant_groups,id',
        ]);

        $menu->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'price' => $validated['price'],
            'station' => $validated['station'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Sync variant groups
        $menu->variantGroups()->sync($validated['variant_groups'] ?? []);

        return redirect()->route('admin.create-menu.index')
            ->with('success', 'Menu updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        // Detach all variant groups first
        $menu->variantGroups()->detach();
        
        // Soft delete the menu
        $menu->delete();

        return redirect()->route('admin.create-menu.index')
            ->with('success', 'Menu deleted successfully.');
    }

    /**
     * Manage variant groups for a specific menu.
     */
    public function manage(Request $request, Menu $menu)
    {
        $search = $request->get('search');
        
        $query = VariantGroup::where('is_active', true)->orderBy('sort_order');
        
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }
        
        $variantGroups = $query->paginate(10)->withQueryString();
        $menuVariantGroups = $menu->variantGroups()->pluck('variant_groups.id')->toArray();

        return Inertia::render('admin/master-data/menu/menu-variants', [
            'menu' => $menu,
            'variantGroups' => $variantGroups,
            'menuVariantGroups' => $menuVariantGroups,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
