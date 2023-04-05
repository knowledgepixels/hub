export const grlcNpApiUrls = [
    'https://grlc.nps.petapico.org/api/local/local/',
    'https://grlc.services.np.trustyuri.net/api/local/local/'
];
export const getUpdateStatus = (npUri) => {
    const shuffledApiUrls = [...grlcNpApiUrls].sort(() => 0.5 - Math.random());
    return getUpdateStatusX(npUri, shuffledApiUrls);
};
const getUpdateStatusX = (npUri, apiUrls) => {
    if (apiUrls.length == 0) {
        return { error: 'error' };
    }
    const apiUrl = apiUrls.shift();
    const requestUrl = apiUrl + '/get_latest_version?np=' + npUri;
    const r = new XMLHttpRequest();
    r.open('GET', requestUrl, true);
    r.setRequestHeader('Accept', 'application/json');
    r.responseType = 'json';
    r.onload = function () {
        if (r.status == 200) {
            const bindings = r.response['results']['bindings'];
            return bindings;
        }
        else {
            return getUpdateStatusX(npUri, apiUrls);
        }
    };
    r.onerror = function () {
        return getUpdateStatusX(npUri, apiUrls);
    };
    return r.send();
};
export const getJson = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'json';
    request.onload = function () {
        const status = request.status;
        if (status === 200) {
            callback(null, request.response);
        }
        else {
            callback(status, request.response);
        }
    };
    request.send();
};
export const getLatestNp = callback => {
    fetch('https://server.np.trustyuri.net/nanopubs.txt')
        .then(response => response.text())
        .then(data => {
        const lines = data.split(/\n/);
        callback(lines[lines.length - 2].trim());
    });
};
export const isTrustyUri = (uri) => {
    return /.*[^A-Za-z0-9_\-](RA[A-Za-z0-9_\-]{43})/.test(uri);
};
export const getArtifactCode = (uri) => {
    if (isTrustyUri(uri))
        return uri.replace(/^.*[^A-Za-z0-9_\-](RA[A-Za-z0-9_\-]{43})$/, '$1');
    return null;
};
export const getShortCode = (uri) => {
    const ac = getArtifactCode(uri);
    if (ac == null)
        return null;
    return ac.substring(0, 10);
};
//# sourceMappingURL=nanopub-utils.js.map