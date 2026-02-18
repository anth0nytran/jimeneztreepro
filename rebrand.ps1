$f = 'c:\Users\antho\Desktop\jimeneztreepro\app\page.tsx'
$c = [System.IO.File]::ReadAllText($f)

# Config replacements
$c = $c.Replace("businessName: 'Jimenez Tree Pro'", "businessName: 'Jimenez Tree Pro'")
$c = $c.Replace("businessOwner: 'Jose Castillo'", "businessOwner: 'Jimenez Family'")
$c = $c.Replace("city: 'Kingwood, TX'", "city: 'Pasadena, TX'")
$c = $c.Replace("address: '4102 Valley Haven Dr, Kingwood, TX 77339'", "address: 'Pasadena, TX - Serving the Greater Houston Area'")
$c = $c.Replace("phone: '(713) 283-8138'", "phone: '(832) 966-7045'")
$c = $c.Replace("primaryService: 'Siding Replacement & Repair'", "primaryService: 'Tree Removal & Trimming'")
$c = $c.Replace("services: ['Roofing Services', 'Professional Painting', 'Window Replacement']", "services: ['Storm Damage Cleanup', 'Stump Grinding', 'Debris Hauling']")
$c = $c.Replace("yearsInBusiness: 15", "yearsInBusiness: 25")

# Theme colors
$c = $c.Replace("pageBg: '#f8fafc'", "pageBg: '#faf7f2'")
$c = $c.Replace("surfaceBg: '#f1f5f9'", "surfaceBg: '#f5f0e8'")

# Accent colors
$c = $c.Replace("name: 'Elite Navy'", "name: 'Forest Green'")
$c = $c.Replace("hex: '#1e3a8a', // Blue-900", "hex: '#166534', // Green-800")
$c = $c.Replace("hoverHex: '#172554' // Blue-950", "hoverHex: '#14532d' // Green-900")

# Image placeholders
$c = $c.Replace("hint: 'Old siding or roof damage'", "hint: 'Overgrown tree or storm damage'")
$c = $c.Replace("hint: 'Fresh paint or new windows'", "hint: 'Clean removal or trimmed tree'")
$c = $c.Replace("hint: 'Jose and team onsite'", "hint: 'Jimenez team onsite'")

# Nav branding
$c = $c.Replace("<span style={{ color: scrolled ? accent : 'white' }}>ELITE</span>", "<span style={{ color: scrolled ? accent : 'white' }}>JIMENEZ</span>")
$c = $c.Replace("<span className=`"ml-1.5`" style={{ color: scrolled ? action : 'white' }}>HOME REPAIRS</span>", "<span className=`"ml-1.5`" style={{ color: scrolled ? action : 'white' }}>PRO-TREE</span>")

# Hero content
$c = $c.Replace("Trusted Home Repairs for Kingwood Homeowners", "Professional Tree Service for Houston Homeowners")
$c = $c.Replace("Protect your home with reliable siding, roofing, painting, and window work.", "Expert tree removal, trimming, stump grinding, and storm cleanup.")
$c = $c.Replace("Clear estimates. Clean job sites. {years}+ years of experience.", "Free estimates. Clean job sites. {years}+ years of experience.")

# Phone placeholder
$c = $c.Replace('placeholder="(713) 555-0123"', 'placeholder="(832) 555-0123"')

# Service descriptions
$c = $c.Replace("Describe your project (e.g. Siding replacement, roof leak...)", "Describe your project (e.g. Tree removal, storm damage cleanup...)")

# Trust badges
$c = $c.Replace("Quality Craftsmanship", "Expert Tree Care")

# Benefits
$c = $c.Replace("'Fast response + quick scheduling'", "'Fast response + quick scheduling'")
$c = $c.Replace("'15+ years of home repair experience'", "'25+ years of tree service experience'")

# Guarantee
$c = $c.Replace("The Elite Quality Promise", "The Jimenez Quality Promise")
$c = $c.Replace("If you aren't completely satisfied with our craftsmanship, we will make it right.", "If you aren`'t completely satisfied with our work, we will make it right.")

# Why Us quote
$c = $c.Replace("We use the best materials and expert crews. Your home renovation adds lasting value.", "We use the right equipment and expert crews. Your property is in safe hands.")
$c = $c.Replace('alt="Elite craftsmanship detail"', 'alt="Professional tree service"')

# CTA
$c = $c.Replace("Get Your Free Home Repair Estimate", "Get Your Free Tree Service Estimate")
$c = $c.Replace("Protect your home with durable, high-quality work", "Protect your property with expert tree care")
$c = $c.Replace("Serving homeowners in Kingwood, Humble, The Woodlands, Spring, Atascocita, and Houston", "Serving homeowners in Pasadena, Houston, Pearland, Friendswood, League City, and Clear Lake")

# Footer
$c = $c.Replace("Setting the standard for home renovation in Kingwood. We replace average with exceptional.", "Setting the standard for tree care in Pasadena and the Greater Houston Area. Expert service, honest pricing.")

# Footer expertise
$c = $c.Replace("'Roofing Systems'", "'Tree Removal'")
$c = $c.Replace("'Siding Replacement'", "'Tree Trimming'")
$c = $c.Replace("'Exterior Painting'", "'Stump Grinding'")
$c = $c.Replace("'Window Installation'", "'Storm Cleanup'")
$c = $c.Replace("'Custom Patios'", "'Debris Hauling'")
$c = $c.Replace("'Gutters & Drainage'", "'Land Clearing'")

# Footer service areas
$c = $c.Replace("Kingwood (HQ)", "Pasadena (HQ)")
$c = $c.Replace("Humble, Atascocita, Porter - fast help for siding and exterior repairs.", "Alvin, Pearland, Friendswood - fast tree removal and storm cleanup.")
$c = $c.Replace("Spring, Conroe, Tomball - trusted roofing, painting, and window updates.", "League City, Clear Lake, Webster - expert trimming, stump grinding, and hauling.")
$c = $c.Replace("Houston, Katy, Sugar Land, Cypress - dependable repairs that protect home value.", "Houston, Deer Park, La Porte, Baytown - dependable tree care that protects property value.")

[System.IO.File]::WriteAllText($f, $c)
Write-Host "All replacements complete!"
