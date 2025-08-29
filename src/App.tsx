@@ .. @@
 import React from 'react';
+import Hero from './components/Hero';
+import Features from './components/Features';
+import ProblemSolution from './components/ProblemSolution';
 
 function App() {
   return (
   )
 }
-    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
-      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
-        <div className="flex items-center justify-center mb-6">
-          <Box className="w-12 h-12 text-indigo-600" />
-        </div>
-        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
-          Perfectly Centered Content
-        </h1>
-        <p className="text-gray-600 mb-4 text-center">
-          This content is centered both horizontally and vertically using Tailwind's
-          powerful flexbox utilities.
-        </p>
-        <div className="space-y-2 text-sm text-gray-500">
-          <p className="flex items-center">
-            <span className="w-4 h-4 mr-2 inline-block bg-indigo-100 rounded-full" />
-            <code className="font-mono">flex</code>: Enables flexbox layout
-          </p>
-          <p className="flex items-center">
-            <span className="w-4 h-4 mr-2 inline-block bg-indigo-100 rounded-full" />
-            <code className="font-mono">items-center</code>: Centers vertically
-          </p>
-          <p className="flex items-center">
-            <span className="w-4 h-4 mr-2 inline-block bg-indigo-100 rounded-full" />
-            <code className="font-mono">justify-center</code>: Centers horizontally
-          </p>
-        </div>
-      </div>
+    <div className="min-h-screen">
+      <Hero />
+      <Features />
+      <ProblemSolution />
     </div>
   );
 }