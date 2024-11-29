class TmdbApi {
    #apiToken;
    #language;

    constructor(apiToken) {
        this.#apiToken = apiToken;
        this.#language = "fr-FR";
        this.baseUrl = "https://api.themoviedb.org/3";
    }

    get apiToken() {
        return this.#apiToken;
    }

    set apiToken(token) {
        if (!token) {
            throw new Error("Le jeton d'accès ne peut pas être vide.");
        }
        this.#apiToken = token;
    }

    get language() {
        return this.#language;
    }

    set language(lang) {
        if (!lang) {
            throw new Error("La langue ne peut pas être vide.");
        }
        this.#language = lang;
    }

    async fetchFromApi(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        params.language = this.#language;
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Jeton ${this.#apiToken}`
                }
            });
            if (!response.status) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API :", error);
            return null;
        }
    }

    async discoverMovies(page = 1) {
        return this.fetchFromApi("/discover/movie", { page });
    }

    async searchMovies(query, page = 1) {
        return this.fetchFromApi("/search/movie", { query, page });
    }
}
