"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getAllUsersAction,
  blockUnblockUserAction,
  deleteUserAction,
} from "./_action";
import { IUser } from "@/types/user.types";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [deleteUser, setDeleteUser] = useState<IUser | null>(null);

  const params: Record<string, string> = {
    page: String(page),
    limit: "10",
  };
  if (search) params.searchTerm = search;
  if (statusFilter !== "ALL") params.status = statusFilter;
  if (roleFilter !== "ALL") params.role = roleFilter;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAllUsersAction(params),
  });

  const { mutate: handleStatusChange, isPending: isStatusPending } =
    useMutation({
      mutationFn: ({
        id,
        status,
      }: {
        id: string;
        status: "ACTIVE" | "BLOCKED" | "SUSPENDED";
      }) => blockUnblockUserAction(id, status),
      onSuccess: (result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success("User status updated");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      },
      onError: () => toast.error("Failed to update user status"),
    });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteUserAction(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("User deleted successfully");
      setDeleteUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const userList: IUser[] = data?.data || [];
  const meta = data?.meta;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
            Active
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge className="text-xs bg-red-500/10 text-red-600 border-red-500/20">
            Blocked
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    return role === "ADMIN" ? (
      <Badge className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/20">
        Admin
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs">
        User
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all registered users
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Joined
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : userList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No users found
                    </p>
                  </td>
                </tr>
              ) : (
                userList.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-muted-foreground">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-40">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-40">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>

                    {/* Status */}
                    <td className="px-4 py-3">{getStatusBadge(user.status)}</td>

                    {/* Joined */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Block / Unblock / Suspend toggle */}
                        {user.status === "ACTIVE" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-red-500"
                            disabled={isStatusPending}
                            onClick={() =>
                              handleStatusChange({
                                id: user.id,
                                status: "BLOCKED",
                              })
                            }
                            title="Block user"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                          </Button>
                        ) : user.status === "BLOCKED" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-green-500"
                            disabled={isStatusPending}
                            onClick={() =>
                              handleStatusChange({
                                id: user.id,
                                status: "ACTIVE",
                              })
                            }
                            title="Unblock user"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-green-500"
                            disabled={isStatusPending}
                            onClick={() =>
                              handleStatusChange({
                                id: user.id,
                                status: "ACTIVE",
                              })
                            }
                            title="Activate user"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteUser(user)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)} of{" "}
            {meta.total} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-foreground">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteUser}
        onOpenChange={() => setDeleteUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteUser?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && handleDelete(deleteUser.id)}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
