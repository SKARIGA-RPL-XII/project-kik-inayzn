import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/produk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProdukController::index
 * @see app/Http/Controllers/ProdukController.php:11
 * @route '/produk'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/produk/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProdukController::create
 * @see app/Http/Controllers/ProdukController.php:22
 * @route '/produk/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/produk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::store
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
export const show = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
show.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: args.produk,
                }

    return show.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
show.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
show.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
    const showForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
        showForm.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProdukController::show
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
        showForm.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
export const edit = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
edit.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: args.produk,
                }

    return edit.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
edit.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
edit.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
    const editForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
        editForm.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProdukController::edit
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}/edit'
 */
        editForm.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
export const update = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/produk/{produk}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
update.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: args.produk,
                }

    return update.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
update.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
update.patch = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
    const updateForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
        updateForm.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ProdukController::update
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
        updateForm.patch = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
export const destroy = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/produk/{produk}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
destroy.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    produk: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        produk: args.produk,
                }

    return destroy.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
destroy.delete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
    const destroyForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProdukController::destroy
 * @see app/Http/Controllers/ProdukController.php:0
 * @route '/produk/{produk}'
 */
        destroyForm.delete = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const produk = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default produk