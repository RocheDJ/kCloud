package ie.djroche.kcloud.models

interface UserStore {
    fun update(user: UserModel)
    fun findAll(): List<UserModel>
    fun findUserById(userID: UInt): UserModel?
    fun findUserByEmail(eMail:String):UserModel?
    fun register(user: UserModel):UInt
    fun register(email: String?, password: String?) :UserModel?
    fun delete(user: UserModel)
    fun login(email: String?, password: String?):Boolean

    fun logOut()
}