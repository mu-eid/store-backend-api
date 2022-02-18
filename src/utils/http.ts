type HTTPErrorRespose = {
    error: {
        route: string;
        reason: string;
    };
};

const httpError = (route: string, error: Error): HTTPErrorRespose => {
    return {
        error: {
            route: route,
            reason: error.message,
        },
    };
};

export { httpError };
