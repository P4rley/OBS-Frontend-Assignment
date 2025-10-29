import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Trash2, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  createUser,
  getUsers,
  getDataById,
  updateUser,
  setLoading,
  deleteUser,
} from "@/store/slices/usersSlice";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/services/users";

const Home = () => {
  const dispatch = useAppDispatch();
  const { users, selectedUser, loading } = useAppSelector(
    (state) => state.users
  );
  const [open, setOpen] = useState(false);
  const [mutate, setMutate] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    id: null as number | null,
    profilePicture: null as string | null | undefined,
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleMutateUser = () => {
    if (mutate && newUser.id) {
      dispatch(setLoading(true));

      dispatch(
        updateUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          profilePicture: newUser.profilePicture,
        })
      );

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 500);
    } else {
      dispatch(setLoading(true));

      dispatch(
        createUser({
          id: users.length + 1,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
        })
      );

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 500);
    }

    setMutate(false);
    setNewUser({
      name: "",
      email: "",
      username: "",
      profilePicture: null,
      id: null,
    });
  };

  const handleGetUserById = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      dispatch(getDataById(user));
      setOpen(true);
    }
  };

  const handleUpdateUser = (user: User) => {
    if (user) {
      setNewUser({
        name: user.name,
        email: user.email,
        username: user.username,
        id: user.id,
        profilePicture: user.profilePicture,
      });

      setMutate(true);
    }
  };

  const onCloseMutateUser = () => {
    setMutate(!mutate);

    if (!mutate) {
      setNewUser({
        name: "",
        email: "",
        username: "",
        id: null,
        profilePicture: null,
      });
    }
  };

  const handleDeleteUser = (id: number) => {
    if (id) {
      dispatch(setLoading(true));
      dispatch(
        deleteUser({
          id,
        })
      );

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 500);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed w-screen h-screen flex items-center justify-center opacity-50 bg-black">
          <Spinner className="text-background" />
        </div>
      )}

      <div className="container mx-auto p-10">
        <h1 className="text-3xl font-bold mb-10">User Lists</h1>

        <Dialog open={mutate} onOpenChange={onCloseMutateUser}>
          <form>
            <div className="flex items-end justify-end w-full">
              <DialogTrigger asChild>
                <Button className="cursor-pointer">Create User</Button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {newUser.id ? "Edit user" : "Create user"}
                </DialogTitle>
                <DialogDescription>
                  Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                {newUser.id && (
                  <div className="flex items-center justify-center w-full mb-2">
                    <img
                      src={newUser?.profilePicture ?? ""}
                      className="rounded-full"
                      alt=""
                    />
                  </div>
                )}
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={newUser.name}
                    onChange={onChangeInput}
                    placeholder="John Doe"
                    className="mt-3"
                  />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input
                    name="username"
                    value={newUser.username}
                    onChange={onChangeInput}
                    placeholder="@johndoe"
                    className="mt-3"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={onChangeInput}
                    placeholder="johndoe@mail.com"
                    className="mt-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  onClick={handleMutateUser}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Detail</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-center w-full mb-2">
                <img
                  src={selectedUser?.profilePicture ?? ""}
                  className="rounded-full"
                  alt=""
                />
              </div>
              <div>
                <Label>Name</Label>
                <p className="text-gray-500">{selectedUser?.name}</p>
              </div>
              <div>
                <Label>Username</Label>
                <p className="text-gray-500">{selectedUser?.username}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-gray-500">{selectedUser?.email}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((user, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-4 truncate w-full">
                  <img
                    src={user.profilePicture ?? ""}
                    alt=""
                    className="rounded-full object-cover w-[50px] h-[50px]"
                  />
                  <span className="truncate w-full block">{user.name}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="truncate w-full block">{user.email}</p>
                <p className="card-small-text truncate w-full block">
                  @{user.username}
                </p>

                <div className="mt-8 flex items-center justify-end gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleGetUserById(user.id)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleUpdateUser(user)}
                  >
                    <UserRoundCog />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
