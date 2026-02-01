
import re
import sys

def get_bounds(svg_content):
    # distinct path strings
    paths = re.findall(r'd="([^"]+)"', svg_content)
    
    all_x = []
    all_y = []
    
    for p in paths:
        # Extract all numbers that look like coordinates
        # M x,y or L x,y etc.
        # This is a rough heuristic but usually suffices for finding bounds
        nums = [float(n) for n in re.findall(r'-?\d*\.?\d+', p)]
        
        # We need to pair them up roughly, or just dump them all in buckets?
        # SVG path commands are complex, but usually coordinates are explicit.
        # Let's just take all numbers. It might include some flags (0/1) for arcs, but won't throw off bounds too much usually.
        # Better: coordinates usually come in pairs.
        
        # Actually, let's look at the ranges.
        # We want to identify clusters.
        i = 0
        while i < len(nums) - 1:
             # Heuristic: simple pairs if mostly absolute
             x = nums[i]
             y = nums[i+1]
             all_x.append(x)
             all_y.append(y)
             i += 2

    if not all_x:
        print("No coords found")
        return

    min_x, max_x = min(all_x), max(all_x)
    min_y, max_y = min(all_y), max(all_y)
    
    print(f"Total Bounds: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
    print(f"Width: {max_x - min_x}, Height: {max_y - min_y}")
    
    # Try to find a gap in X to separate Icon from Text
    all_x.sort()
    max_gap = 0
    gap_at = 0
    for k in range(len(all_x) - 1):
        gap = all_x[k+1] - all_x[k]
        if gap > max_gap:
            max_gap = gap
            gap_at = all_x[k]
            
    print(f"Largest X gap: {max_gap} at around {gap_at}")

    # If we find a significant gap, we can suggest a crop for the left part
    # Let's assume the icon is the left 1/3 roughly?
    
svg_path = r"c:\Users\antho\Desktop\3dfence\public\images\reallogo.svg"
try:
    with open(svg_path, 'r') as f:
        content = f.read()
        get_bounds(content)
except Exception as e:
    print(e)
