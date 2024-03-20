package ie.djroche.kcloud.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import ie.djroche.kcloud.main.MainApp
import ie.djroche.kcloud.models.UserModel
import ie.djroche.kcloud.models.User_Manager

class LoginRegisterViewModel (app: Application) : AndroidViewModel(app) {
    var mainApp: MainApp =  app as MainApp


    var liveUser: MutableLiveData<UserModel?> = mainApp.user_Manager.liveUser
    var userManager:User_Manager =mainApp.user_Manager

    fun login(email: String?, password: String?) {
       // UserManager.login(email, password)
        userManager.login(email, password)
    }

    fun register(email: String?, password: String?) {
       // UserManager.register(email, password)
        userManager.register(email, password)
    }

}