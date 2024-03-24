export const useTimeHook = (prop) => {
        // Create a Date object from the timestamp string
        const date = new Date(prop);

        // Extract individual components
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Determine AM or PM
        const amOrPm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12; // Ensure 12-hour format

        // Construct real-time representation
        const realTime = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
        return realTime;
}
