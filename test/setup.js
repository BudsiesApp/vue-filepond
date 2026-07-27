if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:vue-filepond-test';
}

if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
}

if (!window.matchMedia) {
    window.matchMedia = query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false
    });
}
