package ie.djroche.kcloud.ui.kpi

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import ie.djroche.kcloud.main.MainApp

import ie.djroche.kcloud.models.PVOModel
import ie.djroche.kcloud.models.InstallationModel
import ie.djroche.kcloud.models.PVOTitleModel
import ie.djroche.kcloud.models.UserModel

import timber.log.Timber
import java.lang.Exception


class KPIViewModel (app: Application):  AndroidViewModel(app) {
    // declare the list of sites
    private var kpiList =
        MutableLiveData<List<PVOModel>>()

    // list of kpi as observable by the view model
    val observableKPIList: LiveData<List<PVOModel>>
        get() = kpiList

    val observableTitleList: LiveData<List<PVOTitleModel>>
        get() = titleList

    private val _SiteDescription =
        MutableLiveData<String>()

    val observableSiteDescription :LiveData<String>
        get() = _SiteDescription

    private var titleList =
        MutableLiveData<List<PVOTitleModel>>()

    var mainApp: MainApp =  app as MainApp

    var currentLiveUser = MutableLiveData<UserModel>()

    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------
    fun getKPIs(userid:UInt, id: String) {
        try {
            mainApp.pvo_Manager.getPVOs(userid,id,titleList,kpiList)// return the list of KPIS from
            Timber.i("Detail getPVOs() Success : ${kpiList.value.toString()}")
        }
        catch (e: Exception) {
            Timber.i("Detail getKPIs() Error : $e.message")
        }
    }

    //-----------------------------------------------------------------------------
    fun getTitles(userid:UInt, id: String) {
        try {
            mainApp.pvo_Manager.findTitles(userid,id,titleList)// return the list of KPIS from
            Timber.i("Detail getTitles() Success : ${titleList.value.toString()}")
        }
        catch (e: Exception) {
            Timber.i("Detail getKPIs() Error : $e.message")
        }
    }
    //-----------------------------------------------------------------------------
    fun delete(userid: UInt, id: String) {
        //ToDo: complete Delete
        try {
            val site = MutableLiveData<InstallationModel>()
            mainApp.site_Manager.findById(userid,id,site)
        //    mainApp.site_Manager.delete(userid,site.value!!)
            Timber.i("Site Delete Called")
        } catch (e: Exception) {
            Timber.i("Site Delete Error : $e.message")
        }
    }
    //-----------------------------------------------------------------------------
    fun addKPI(userid: String, site: InstallationModel, kpiData:PVOModel) {
      //  mainApp.site_Manager.addKPI(userid,site,kpiData)
        Timber.i("KPI Add Called")
    }
    //----------------------------------------------------------------------------
    fun updateSiteDescription(userid: String, site: InstallationModel, newDescription :String) {
        try {
            val MySite = site.copy()
            MySite.description = newDescription
            mainApp.site_Manager.update(userid,MySite)

            Timber.i("Site update called")
        } catch (e: Exception) {
            Timber.i("Site Update Error : $e.message")
        }
    }

}