import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if token is expiring soon (within 10 seconds)
export async function isTokenExpiringSoon() {
    const expirationTime = await AsyncStorage.getItem('expiresIn');
    const currentTime = Date.now();  // Get current time in milliseconds

    console.log("EXP TIME: ", expirationTime);
    console.log("CURRENT TIME: ", currentTime)
    console.log(expirationTime - currentTime);
    return expirationTime - currentTime < 600000;  // Token is expiring in less than 10 minutes
}

// Refresh the token
export async function refreshToken() {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        
        const response = await fetch('https://pos.sswellness.com.my/app/refresh', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
            await AsyncStorage.setItem('accessToken', data.access_token);
            await AsyncStorage.setItem('expiresIn', (Date.now() + data.expires_in * 60 * 1000).toString());

            console.log("Token Refreshed Successfully");
            return true;
        } else {
            console.error('Failed to refresh token:', data);
            return false;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
}

// Start monitoring the token expiration
export async function startTokenMonitor(navigation) {

    const onLoginIsTokenExpired = async () => {

        if (await isTokenExpiringSoon()) {
            await refreshToken();
            if (!refreshResult) {

                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('expiresIn');
                console.log("Token is expired, so loging out");
                // Navigate to the login page if the token refresh fails
                navigation.navigate('Login');  // Replace 'Login' with your actual login route name
            }
        }

    }

    await onLoginIsTokenExpired();

    setInterval(async () => {
        if (await isTokenExpiringSoon()) {
            const refreshResult = await refreshToken();
            if (!refreshResult) {

                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('expiresIn');

                // Navigate to the login page if the token refresh fails
                navigation.navigate('Login');  // Replace 'Login' with your actual login route name
            }
        }
    }, 300000);  // Check every 5 minutes

}