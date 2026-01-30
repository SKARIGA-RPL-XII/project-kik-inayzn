import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
export const showLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

showLogin.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
showLogin.url = (options?: RouteQueryOptions) => {
    return showLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
showLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
showLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLogin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
    const showLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showLogin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
        showLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showLogin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuthController::showLogin
 * @see app/Http/Controllers/AuthController.php:13
 * @route '/login'
 */
        showLoginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showLogin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showLogin.form = showLoginForm
/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:18
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:18
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:18
 * @route '/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:18
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:18
 * @route '/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:63
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:63
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:63
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:63
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:63
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
export const showRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

showRegister.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
showRegister.url = (options?: RouteQueryOptions) => {
    return showRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
showRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
showRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRegister.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
    const showRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showRegister.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
        showRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showRegister.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuthController::showRegister
 * @see app/Http/Controllers/AuthController.php:40
 * @route '/register'
 */
        showRegisterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showRegister.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showRegister.form = showRegisterForm
/**
* @see \App\Http\Controllers\AuthController::storeRegister
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/register'
 */
export const storeRegister = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRegister.url(options),
    method: 'post',
})

storeRegister.definition = {
    methods: ["post"],
    url: '/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::storeRegister
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/register'
 */
storeRegister.url = (options?: RouteQueryOptions) => {
    return storeRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::storeRegister
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/register'
 */
storeRegister.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRegister.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::storeRegister
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/register'
 */
    const storeRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRegister.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::storeRegister
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/register'
 */
        storeRegisterForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRegister.url(options),
            method: 'post',
        })
    
    storeRegister.form = storeRegisterForm
const AuthController = { showLogin, login, logout, showRegister, storeRegister }

export default AuthController