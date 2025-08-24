<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MenuVariant;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class MenuVariantController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuVariant::with(['menu.category']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('menu', function ($menuQuery) use ($searchTerm) {
                      $menuQuery->where('name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }

        // Filter by menu
        if ($request->has('menu_id') && $request->menu_id) {
            $query->where('menu_id', $request->menu_id);
        }

        $menuVariants = $query->orderBy('menu_id')
                             ->orderBy('name')
                             ->paginate(10)
                             ->withQueryString();

        // Get all menus for filter dropdown
        $menus = Menu::with('category')->orderBy('name')->get();

        return Inertia::render('admin/master-data/menu-variant/menu-variant-manager', [
            'menuVariants' => $menuVariants,
            'menus' => $menus,
            'filters' => $request->only(['search', 'menu_id']),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('MenuVariant Store Request', $request->all());

        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'name' => 'required|string|max:255',
            'extra_price' => 'required|numeric|min:0',
        ]);

        Log::info('MenuVariant Validation Passed', $validated);

        try {
            $menuVariant = MenuVariant::create($validated);
            Log::info('MenuVariant Created Successfully', $menuVariant->toArray());

            return redirect()->route('menu-variants.index')
                           ->with('success', 'Menu variant created successfully.');
        } catch (\Exception $e) {
            Log::error('MenuVariant Creation Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to create menu variant.']);
        }
    }

    public function update(Request $request, MenuVariant $menuVariant)
    {
        Log::info('MenuVariant Update Request', [
            'id' => $menuVariant->id,
            'data' => $request->all()
        ]);

        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'name' => 'required|string|max:255',
            'extra_price' => 'required|numeric|min:0',
        ]);

        Log::info('MenuVariant Update Validation Passed', $validated);

        try {
            $menuVariant->update($validated);
            Log::info('MenuVariant Updated Successfully', $menuVariant->fresh()->toArray());

            return redirect()->route('menu-variants.index')
                           ->with('success', 'Menu variant updated successfully.');
        } catch (\Exception $e) {
            Log::error('MenuVariant Update Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update menu variant.']);
        }
    }

    public function destroy(MenuVariant $menuVariant)
    {
        Log::info('MenuVariant Delete Request', ['id' => $menuVariant->id, 'name' => $menuVariant->name]);

        try {
            $menuVariant->delete();
            Log::info('MenuVariant Deleted Successfully');

            return redirect()->route('menu-variants.index')
                           ->with('success', 'Menu variant deleted successfully.');
        } catch (\Exception $e) {
            Log::error('MenuVariant Delete Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to delete menu variant.']);
        }
    }
}
