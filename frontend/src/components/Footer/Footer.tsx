import { Github, GlobeIcon, Linkedin, Mail } from "lucide-react";
import { JSX, useState } from "react";
import { Link } from 'react-router-dom';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Footer = (): JSX.Element => {
    const [lang, setLang] = useState<string>("English");

    return (
        // idk what data model id is, but it looks cool so i keep
        <footer className="w-full bg-border py-10 px-4 pb-4 border-t-1 border-t-gray-300" data-model-id="67:306">
            <div className="container mx-auto max-w-7xl">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Brand section */}
                    <div className="col-span-1 md:col-span-4">
                        <h5 className="font-bold text-5xl md:text-6xl font-sans text-black">
                            Belong Anywhere
                        </h5>
                    </div>

                    {/* Footer columns */}
                    <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-base mb-6 text-black">About</h3>
                            <ul className="space-y-2">
                                <li className="text-xs text-black leading-7">
                                    <Link to={"/home"} className="hover:underline">
                                        About us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-base mb-6 text-black">Explore</h3>
                            <ul className="space-y-2">
                                <li className="text-xs text-black leading-7">
                                    <Link to={"/home"} className="hover:underline">
                                        Home
                                    </Link>
                                </li>
                                <li className="text-xs text-black leading-7">
                                    <Link to={"/listings"} className="hover:underline">
                                        Search Listings
                                    </Link>
                                </li>
                                <li className="text-xs text-black leading-7">
                                    <Link to={"/host"} className="hover:underline">
                                        Become a host
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-base mb-6 text-black">Support & Legal</h3>
                            <ul className="space-y-2">
                                <li className="text-xs text-black leading-7">
                                    <Link to={"/support"} className="hover:underline">
                                        Support
                                    </Link>
                                </li>
                                <li className="text-xs text-black leading-7">
                                    <a href="#" className="hover:underline">Terms of Service</a>
                                </li>
                                <li className="text-xs text-black leading-7">
                                    <a href="#" className="hover:underline">Privacy Policy</a>
                                </li>
                                <li className="text-xs text-black leading-7">
                                    <a href="#" className="hover:underline">Cookie Policy</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


            </div>

            {/* <Separator className="my-8 w-full" orientation="horizontal" /> */}

            {/* Footer bottom section */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 border-t border-t-gray-300 pt-4 mt-4">
                <div className="text-sm md:text-base text-black text-center md:text-left">
                    © 2025 Airbnb Camping · Terms · Sitemap · Privacy · Your Privacy
                    Choices ✅/❌
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger>
                                <div className="flex items-center">
                                    <GlobeIcon className="w-5 h-5 mr-2" />
                                    <span className="text-sm md:text-base text-black">{lang}</span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => setLang("English")}>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLang("Dutch")}>
                                    Dutch
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLang("French")}>
                                    French 🤮
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLang("German")}>
                                    German
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="https://github.com/l145dev/" target="_blank" className="text-black hover:text-gray-600">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/in/aryan-shah-l145/" target="_blank" className="text-black hover:text-gray-600">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="mailto:aryan.shah@l145.be" target="_blank" className="text-black hover:text-gray-600">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};