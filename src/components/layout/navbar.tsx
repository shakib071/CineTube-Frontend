"use client";

import Image from "next/image";
import { Baby, Clapperboard, Menu,  Sword, Theater, Tv,  } from "lucide-react";
import {
  Flame,
  Laugh,
  Eye,
  Rocket,
  Skull,
  Heart,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./modeToggle";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/services/auth.service";
import { IUser } from "@/types/user.types";


interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}


interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
      authrequired?: boolean;
    };
    signup: {
      title: string;
      url: string;
      authrequired?: boolean;
    };
    profile: {
      title: string;
      url: string;
      authrequired?: boolean;
    };
    logout: {
      title: string;
      url: string;
      authrequired?: boolean;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    // { title: "Home", url: "/" },
    {
      title:"All-media",
      url: "/all-media",
    },
    {
      title: "Movies",
      url: "/movies",
    },
    {
      title: "Series",
      url: "/series",
    },
    {
      title: "Top Rated",
      url: "/top-rated",
    },


    {
      title: "Browse Genres",
      url: "/browse-genre",
      items: [
        {
          title: "Action",
          description: "High-octane thrills, explosive sequences and epic battles",
          icon: <Flame className="size-5 shrink-0 text-orange-500" />,
          url: "/browse-genre/action",
        },
        {
          title: "Drama",
          description: "Powerful stories driven by emotion and human connection",
          icon: <Theater className="size-5 shrink-0 text-purple-500" />,
          url: "/browse-genre/drama",
        },
        {
          title: "Comedy",
          description: "Laugh out loud moments and feel-good entertainment",
          icon: <Laugh className="size-5 shrink-0 text-yellow-400" />,
          url: "/browse-genre/comedy",
        },
        {
          title: "Thriller",
          description: "Edge of your seat suspense that keeps you guessing",
          icon: <Eye className="size-5 shrink-0 text-red-500" />,
          url: "/browse-genre/thriller",
        },
        {
          title: "Sci-Fi",
          description: "Explore the future, space and technology gone beyond limits",
          icon: <Rocket className="size-5 shrink-0 text-blue-400" />,
          url: "/browse-genre/sci-fi",
        },
        {
          title: "Horror",
          description: "Dark, terrifying tales that will haunt your nightmares",
          icon: <Skull className="size-5 shrink-0 text-gray-400" />,
          url: "/browse-genre/horror",
        },
        {
          title: "Romance",
          description: "Heartwarming love stories that make you feel everything",
          icon: <Heart className="size-5 shrink-0 text-pink-500" />,
          url: "/browse-genre/romance",
        },
        {
          title: "Adventure",
          description: "Epic journeys, daring quests and uncharted territories",
          icon: <Sword className="size-5 shrink-0 text-amber-500" />,
          url: "/browse-genre/adventure",
        },
      
        {
          title: "Animation",
          description: "Imaginative worlds brought to life frame by frame",
          icon: <Baby className="size-5 shrink-0 text-green-400" />,
          url: "/browse-genre/animation",
        },
       
        {
          title: "Others",
          description: "Discover hidden gems that don't fit the usual categories",
          icon: <Clapperboard className="size-5 shrink-0 text-rose-400" />,
          url: "/browse-genre/others",
        },
      ],
    },
    // {
    //   title: "Watchlist",
    //   url: "/watchlist",
    // },
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    
  ],

  auth = {
    login: { title: "Login", url: "/login", authrequired: false },
    signup: { title: "Register", url: "/register",authrequired: false },
    profile: { title: "Profile", url: "/profile", authrequired: true },
    logout: { title: "Logout", url: "/logout", authrequired: true },
  },
  className,
}: Navbar1Props) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const user = await getUserInfo();
      setUser(user);
    }
    getUser();
  }, [])

  

  console.log(user);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <section className={cn("py-4 shadow-md", className)}>
        <div className="container mx-auto">
          {/* Desktop Menu - Loading state */}
          <nav className="hidden items-center justify-between lg:flex">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href={logo.url} className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                    <Tv className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
                </div>
                <span
                  className="text-xl font-black tracking-tight"
                  style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
                >
                  Cine<span className="text-red-500">Tube</span>
                </span>
              </Link>
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="flex gap-2">
              <ModeToggle />
              {/* Loading state - show login/signup buttons */}
              <Button asChild variant="outline" size="sm">
                <a href={auth.login.url}>{auth.login.title}</a>
              </Button>
              <Button asChild size="sm">
                <a href={auth.signup.url}>{auth.signup.title}</a>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu - Loading state */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              <Link href={logo.url} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Tv className="w-4 h-4 text-white" />
                </div>
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                          <Tv className="w-4 h-4 text-white" />
                        </div>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-4">
                    {menu.map((item) => (
                      <Link key={item.url} href={item.url} className="text-sm font-medium">
                        {item.title}
                      </Link>
                    ))}
                    <div className="flex flex-col gap-2 mt-4">
                      <Button asChild variant="outline" size="sm">
                        <a href={auth.login.url}>{auth.login.title}</a>
                      </Button>
                      <Button asChild size="sm">
                        <a href={auth.signup.url}>{auth.signup.title}</a>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-4 shadow-md", className)}>
      <div className="container mx-auto ">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex  items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                  <Tv className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
              </div>
              <span
                className="text-xl font-black tracking-tight "
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
              >
                Cine<span className="text-red-500">Tube</span>
              </span>
            </Link>
            <div className="flex  items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
          
            <ModeToggle />
            {
              !user ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <a href={auth.login.url}>{auth.login.title}</a>
                  </Button>
                  <Button asChild size="sm">
                    <a href={auth.signup.url}>{auth.signup.title}</a>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <a href={auth.profile.url}>{auth.profile.title}</a>
                  </Button>
                  <Button asChild size="sm">
                    <a href={auth.logout.url}>{auth.logout.title}</a>
                  </Button>
                </>
              )
            } 
            
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {logo.src ? (
                <Image
                  src={logo.src}
                  className="max-h-8 dark:invert"
                  alt={logo.alt}
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Tv className="w-4 h-4 text-white" />
                </div>
              )}
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      {logo.src ? (
                        <Image
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                          <Tv className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild>
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground max-h-140 overflow-y-auto">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
