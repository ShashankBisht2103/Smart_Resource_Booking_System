import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Users, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as backend from "@/integrations/backend/client";

const AdminResources = () => {
  const { isAuthenticated, loading, userRole, user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingResources, setLoadingResources] = useState(true);
  const [deletingResourceId, setDeletingResourceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!isAuthenticated || userRole !== 'admin') return;
      
      setLoadingResources(true);
      try {
        // Fetch all resources from backend
        const allResources = await backend.getResources();
        setResources(allResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to load resources");
      } finally {
        setLoadingResources(false);
      }
    };
    
    if (isAuthenticated && userRole === 'admin') {
      fetchResources();
    }
  }, [isAuthenticated, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCancelAllBookings = async (resourceId: number, resourceName: string) => {
    if (!window.confirm(`Are you sure you want to cancel ALL bookings for ${resourceName}? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingResourceId(resourceId);
    try {
      await backend.cancelAllBookingsForResource(resourceId, user?.id, userRole || undefined);
      toast.success(`All bookings for ${resourceName} have been cancelled`);
      
      // Refresh resources
      const updatedResources = await backend.getResources();
      setResources(updatedResources);
    } catch (error: any) {
      console.error("Error cancelling bookings:", error);
      if (error.message && error.message.includes('Permission denied')) {
        toast.error("Permission denied: You cannot perform this action");
      } else {
        toast.error("Failed to cancel bookings");
      }
    } finally {
      setDeletingResourceId(null);
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold">Resource Management</h1>
            <p className="text-muted-foreground mt-2">Manage resources and cancel all bookings</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Resources</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage resources and book on behalf of users
                  </p>
                </div>
                <Button onClick={() => navigate("/admin/requests")} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Resource for User
                </Button>
              </div>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by resource name, type or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loadingResources ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{resource.type_name}</Badge>
                        </TableCell>
                        <TableCell>{resource.description}</TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{resource.capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAllBookings(resource.id, resource.name)}
                            disabled={deletingResourceId === resource.id}
                          >
                            {deletingResourceId === resource.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Cancel All Bookings
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminResources;