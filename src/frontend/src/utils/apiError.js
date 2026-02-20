export function parseApiError(err) {
    if (!err || !err.response) return "Server not reachable";

    const { status, data } = err.response;

    if (typeof data === "string")
        return data;

    if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        return data.errors[firstKey][0];
    }

    if (data?.error) {
        return data.error;
    }

    switch (status) {
        case 401: return "Invalid email or password";
        case 403: return "You are not approved yet by admin";
        case 404: return "Service not found";
        case 500: return "Server error occurred";
        default: return "Something went wrong";
    }
}
