import AuthController from './AuthController'
import ProdukController from './ProdukController'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    AuthController: Object.assign(AuthController, AuthController),
ProdukController: Object.assign(ProdukController, ProdukController),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers