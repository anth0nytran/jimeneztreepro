
import re

def analyze_clusters(svg_path):
    with open(svg_path, 'r') as f:
        content = f.read()

    # remove header to avoid viewBox numbers
    body = content.split('>', 1)[1] if '>' in content else content
    
    # find all numbers
    nums = [float(n) for n in re.findall(r'-?\d*\.?\d+', body)]
    
    # Filter reasonable range (0 to 1408)
    x_coords = sorted([n for n in nums if 200 < n < 1000]) # approximate range based on previous obs
    
    if not x_coords:
        print("No coords in range")
        return

    # Find gaps
    gaps = []
    for i in range(len(x_coords)-1):
        diff = x_coords[i+1] - x_coords[i]
        if diff > 10: # meaningful gap
            gaps.append((diff, x_coords[i], x_coords[i+1]))
            
    gaps.sort(key=lambda x: x[0], reverse=True)
    
    print(f"Top 5 gaps: {gaps[:5]}")
    print(f"Min X: {min(x_coords)}, Max X: {max(x_coords)}")
    
    # Also Y coords? 
    # Hard to distinguish X and Y just by list of numbers, but min/max gives bounding box.
    # Let's just rely on X gaps to split horizontally (Icon | Text)

analyze_clusters(r"c:\Users\antho\Desktop\3dfence\public\images\reallogo.svg")
