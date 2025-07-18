"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import UserTable from "@/app/(main)/users/users_list/UserTable/UserTable"
import {
  UserPlus,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import FilterForm from "@/app/(main)/users/users_list/UsersComponents/FilterForm"
import router from "next/dist/shared/lib/router/router"
import PageLoading from "@/components/PageLoading"
import Signup from "../adduser/signup"
import { getAutoData } from "../../service/userService"

export default function UserListClient() {
  const [isChecking, setIsChecking] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [userFetch, setUserFetch] = useState<UserData[]>([])
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<department[]>([]);
  const [positions, setPositions] = useState<position[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [filters, setFilters] = useState({
    position: "",
    department: "",
    branch: "",
    filter: "",
  })

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAutoData();
      setUserFetch(data?.filter(data => data.key === 'users')[0].data || []);
      setBranches(data?.filter(data => data.key === 'branch')[0].data.data || []);
      setDepartments(data?.filter(data => data.key === 'department')[0].data.data || []);
      setPositions(data?.filter(data => data.key === 'position')[0].data.data || []);
      setSections(data?.filter(data => data.key === 'section')[0].data.data || [])
      setIsChecking(false)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true)
      await fetchUsers()
    }
    checkAuth()
  }, [fetchUsers, router])

  const filteredUsers = useMemo(() => {
    let filtered = userFetch;

    if (filters.department && filters.department.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.DepID.toString() === filters.department;
      });
    }

    if (filters.position && filters.position.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.PositionID.toString() === filters.position;
      });
    }

    if (filters.branch && filters.branch.trim() !== "") {
      filtered = filtered.filter(user => {
        return user.BranchID.toString() === filters.branch;
      });
    }

    if (filters.filter && filters.filter.trim() !== "") {
      filtered = filtered.filter(user => {
        switch (filters.filter) {
          case "active":
            return user.Actived === true;
          case "inactive":
            return user.Actived === false;
          case "":
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [userFetch, filters]);

  const handleFilterSelect = useCallback((filterType: string) => {
    setFilters(prev => ({ ...prev, filter: filterType }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      position: "",
      department: "",
      branch: "",
      filter: "",
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  if (isChecking) {
    return (
      <PageLoading />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* User Management Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage and monitor all users in your system
                </CardDescription>
              </div>

              <div className="space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="grid grid-cols-3 sm:flex justify-end space-x-2 space-y-3 sm:space-y-0 mr-[0px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-xs sm:text-sm" asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {filters.filter && filters.filter !== "" && (
                          <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                            {filters.filter === "active" ? "Active" :
                              filters.filter === "inactive" ? "Inactive" : ""}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleFilterSelect("")}>
                        All Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterSelect("active")}>
                        Active Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterSelect("inactive")}>
                        Inactive Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFilterSelect("new")}>
                        New Users
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {(filters.position || filters.department || filters.branch || filters.filter !== "") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs sm:text-sm"
                    >
                      Clear Filters
                    </Button>
                  )}

                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>

                  <Button className="text-xs sm:text-sm" variant="outline" size="sm" onClick={fetchUsers}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>

                  <Button onClick={() => setOpenCreate(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                  <Signup
                    open={openCreate}
                    onOpenChange={setOpenCreate}
                    onUserCreated={fetchUsers}
                    users={userFetch}
                    branches={branches}
                    departments={departments}
                    positions={positions}
                    sections={sections}
                  />
                </div>

                <FilterForm
                  filters={filters}
                  branches={branches}
                  departments={departments}
                  positions={positions}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <UserTable
                data={filteredUsers}
                fetchUsers={fetchUsers}
                branches={branches}
                departments={departments}
                positions={positions}
                sections={sections}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}