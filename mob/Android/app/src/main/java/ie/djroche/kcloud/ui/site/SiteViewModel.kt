package ie.djroche.kcloud.ui.site

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData

import ie.djroche.kcloud.models.InstallationModel
import ie.djroche.kcloud.main.MainApp
import ie.djroche.kcloud.models.UserModel
import timber.log.Timber
import java.lang.Exception

class SiteViewModel (app: Application) : AndroidViewModel(app) {
    // declare the list of sites
    private var siteList =
        MutableLiveData<List<InstallationModel>>()
    
    // list of sites as observable by the view model
    val observableSiteList: LiveData<List<InstallationModel>>
        get() = siteList

    private var _site =
        MutableLiveData<InstallationModel>()

    var liveSite = MutableLiveData<InstallationModel?>()

    val observableSite: MutableLiveData<InstallationModel>
        get() = _site

    var currentLiveUser = MutableLiveData<UserModel>()

    var mainApp: MainApp =  app as MainApp
    //-----------------------------------------------------------------------------
    init {
        load()
    }
    //-----------------------------------------------------------------------------
    fun load() {
        try {
            var userId : UInt = currentLiveUser.value?.id!!//203u
            mainApp.site_Manager.findAllForUser(userId,siteList)
            Timber.i("SiteViewModel Load Success : ${siteList.value.toString()}")
        } catch (e: Exception) {
            Timber.e("SiteViewModel Load Error : $e.message")
        }
    }
    //-----------------------------------------------------------------------------
    fun findByID(userid: UInt, id: String){
        try {
            mainApp.site_Manager.findByQR(userid,id,_site)
            if (_site.value != null){
                liveSite.postValue(_site.value)
            }
            Timber.i("Site findByQR Called")
        } catch (e: Exception) {
            Timber.e("Site findByQR Error : $e.message")
        }
    }
    //-----------------------------------------------------------------------------
    fun delete(userid: UInt, id: String) {
        try {
            val site = MutableLiveData<InstallationModel>()
            mainApp.site_Manager.findById(userid,id,site)
            site.value?.let {
              //ToDo:   mainApp.site_Manager.delete(userid, it)
            }
            // FirebaseDBManager.delete(userid,id)
            Timber.i("Site Delete Called")
        } catch (e: Exception) {
            Timber.i("Site Delete Error : $e.message")
        }
    }

    fun addSite(
        user: MutableLiveData<UserModel?>,
        site: InstallationModel) {
        try {

            Timber.i("Site Add Called")
        } catch (e: Exception) {
            Timber.e("Site Add Error : $e.message")
        }
    }
    //-----------------------------------------------------------------------------
    fun clearSite()
    {
        _site.value!!.id= null!!
    }

}