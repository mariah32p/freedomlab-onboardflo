@@ .. @@
       setShowCreateSessionModal(false);
       
       // Refresh sessions list
       window.location.reload();
     } catch (err) {
       console.error('Error creating session:', err);
       alert('Failed to create session. Please try again.');
     } finally {
       setCreatingSession(false);
     }
   };

+  const handleSendWelcomeEmail = async (session: any) => {
+    // TODO: Implement welcome email via Resend API
+    alert('Welcome email feature coming soon! Will use Resend API to send personalized welcome emails.');
+    setSessionActions(prev => ({ ...prev, [session.id]: 'sent' }));
+  };
+
+  const handleScheduleReminders = async (session: any) => {
+    // TODO: Implement reminder scheduling
+    alert('Reminder scheduling feature coming soon! Will allow setting up automated follow-up emails.');
+    setSessionActions(prev => ({ ...prev, [session.id]: 'scheduled' }));
+  };
+
   const getStatusColor = (session: any) => {