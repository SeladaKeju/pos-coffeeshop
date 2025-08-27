<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query()->withCount('menus');
        
        // Handle search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Order by sort then by name
        $categories = $query->orderBy('sort')->orderBy('name')->get();
        
        return Inertia::render('admin/master-data/category/category-manager', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->search
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'sort' => 'required|integer|min:1'
        ]);

        Category::create([
            'name' => $request->name,
            'sort' => $request->sort,
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'sort' => 'required|integer|min:1'
        ]);

        $category->update([
            'name' => $request->name,
            'sort' => $request->sort,
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully');
    }

    public function destroy(Category $category)
    {
        // Check if category has menus
        if ($category->menus()->count() > 0) {
            return redirect()->route('categories.index')
                ->with('error', 'Cannot delete category that has menus');
        }

        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }
}
