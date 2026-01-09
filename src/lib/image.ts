export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

/**
 * Returns a Google Street View Static API URL for the given address.
 * Docs: https://developers.google.com/maps/documentation/streetview/intro
 */
export const getStreetViewUrl = (location: string): string => {
    if (!location || location === "주소 미상") return "";

    // Clean up location string if needed (remove parens etc)
    const cleanLocation = location.split("(")[0].trim();
    const encodedLocation = encodeURIComponent(cleanLocation);

    // size: Image size (width x height)
    // fov: Field of view (default is 90)
    // pitch: Camera pitch (default is 0)
    // source: outdoor (prioritize outdoor imagery)
    // return_error_code: true (returns 404 instead of gray image if not found)
    return `https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${encodedLocation}&fov=90&heading=0&pitch=0&return_error_code=true&source=outdoor&key=${GOOGLE_MAPS_API_KEY}`;
};

/**
 * Returns a Google Static Maps API URL as a fallback or alternative.
 */
export const getStaticMapUrl = (location: string): string => {
    if (!location || location === "주소 미상") return "";

    // Clean up location string
    const cleanLocation = location.split("(")[0].trim();
    const encodedLocation = encodeURIComponent(cleanLocation);

    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7C${encodedLocation}&key=${GOOGLE_MAPS_API_KEY}`;
};
