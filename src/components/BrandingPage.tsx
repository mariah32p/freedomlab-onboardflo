@@ .. @@
                <form onSubmit={handleSave} className="space-y-6">
+                  {/* Business Name */}
+                  <div>
+                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
+                      Business Name
+                    </label>
+                    <input
+                      type="text"
+                      value={businessName}
+                      onChange={(e) => setBusinessName(e.target.value)}
+                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
+                      placeholder="Your Business Name"
+                    />
+                    <p className="text-xs text-gray-500 mt-1 font-sans">
+                      Used in email communications to customers
+                    </p>
+                  </div>
+
                   {/* Logo Upload */}
                   <div>
@@ .. @@
                   {/* Font Family */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                       Font Family
                     </label>
                     <select
                       value={fontFamily}
                       onChange={(e) => setFontFamily(e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                     >
                       {FONT_OPTIONS.map((font) => (
                         <option key={font.value} value={font.value}>
                           {font.label}
                         </option>
                       ))}
                     </select>
                   </div>
-
-                  {/* Business Name */}
-                  <div>
-                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
-                      Business Name
-                    </label>
-                    <input
-                      type="text"
-                      value={businessName}
-                      onChange={(e) => setBusinessName(e.target.value)}
-                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
-                      placeholder="Your Business Name"
-                    />
-                    <p className="text-xs text-gray-500 mt-1 font-sans">
-                      Used in email communications to customers
-                    </p>
-                  </div>