import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brown-900 text-cream-100 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brown-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold tracking-tight mb-2">Ellie's Bichon Frise Sanctuary</h3>
                        <p className="text-cream-200 max-w-sm text-sm">
                            Connecting loving families across the USA, Canada, and Australia with healthy, well-cared-for Bichon Frise puppies.
                        </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-cream-200 mt-6 md:mt-0">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>by Ellie</span>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-brown-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-200 opacity-80">
                    <div>
                        &copy; {new Date().getFullYear()} Ellie's Bichon Frise Sanctuary. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
