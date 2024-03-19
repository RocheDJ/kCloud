package ie.djroche.kcloud.ui.kpi

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.Observer
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.navigation.ui.NavigationUI
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import ie.djroche.kcloud.R
import ie.djroche.kcloud.activities.QRScanActivity
import ie.djroche.kcloud.adaptors.KPIGridClickListener
import ie.djroche.kcloud.adaptors.KPIGridViewAdaptor
import ie.djroche.kcloud.auth.LoggedInViewModel
import ie.djroche.kcloud.databinding.FragmentKPIBinding
import ie.djroche.kcloud.models.PVOModel
import ie.djroche.kcloud.models.listKpiType

import ie.djroche.kcloud.utils.createLoader
import ie.djroche.kcloud.utils.hideLoader
import ie.djroche.kcloud.utils.showLoader
import timber.log.Timber

class KPIFragment : Fragment(), KPIGridClickListener {
    private var _fragBinding: FragmentKPIBinding? = null
    private val fragBinding get() = _fragBinding!!
    private lateinit var kpiViewModel: KPIViewModel
    private val loggedInViewModel: LoggedInViewModel by activityViewModels()
    lateinit var loader: AlertDialog
    private val args by navArgs<KPIFragmentArgs>()

    private val intentLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                val scannedQR =  result.data?.getStringExtra("scannedQR")
                if (scannedQR != null) {
                    processQRScan(scannedQR)
                }
                Timber.i("QR Observer registerForActivityResult = $scannedQR")
            }
        }
    //----------------------------- Fragment View Creation -----------------------------------------
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _fragBinding = FragmentKPIBinding.inflate(inflater, container, false)
        val root = fragBinding.root
        setupMenu()
        loader = createLoader(requireActivity())
        showLoader(loader, "Downloading KPI List")
        // load the view models
        kpiViewModel = ViewModelProvider(this).get(KPIViewModel::class.java)

        kpiViewModel.observableKPIList.observe(viewLifecycleOwner, Observer { kpis ->
            kpis?.let {
                render(kpis as ArrayList<PVOModel>)
                hideLoader(loader)
                checkSwipeRefresh()
            }
        })
        setSwipeRefresh()
        //
        loggedInViewModel.liveUser.observe(viewLifecycleOwner, Observer { myLiveUser ->
            if (myLiveUser != null) {
                loggedInViewModel.liveUser.value!!.id
                kpiViewModel.currentLiveUser.value = myLiveUser
            }
        })
        // if titles list changes load kpi's
        kpiViewModel.observableTitleList.observe(viewLifecycleOwner, Observer { titles ->
            if (titles!=null){
                kpiViewModel.getKPIs(
                    loggedInViewModel.liveUser.value!!.id,
                    args.siteID
                )
            }
        })

        return root
    }

    // ---------------------------- Click on a grid element --------------------------------------------------------
    override fun onKPIGridClick(kpi: PVOModel) {
        Timber.i("KPI Grid click " + kpi.title)
    }

    // ------------------------- RENDER the Fragment ---------------------------------------------------------
    private fun render(kpiList: ArrayList<PVOModel>) {
        val kpiAdapter = KPIGridViewAdaptor(kpiList, this.requireContext().applicationContext, this)
        fragBinding.gridView.adapter =
            kpiAdapter //KPIGridViewAdaptor(kpiList,fragBinding.root.context,this)
       // fragBinding.editSiteName.setText("---") // give the edit text an initial value

        if (kpiList.isEmpty()) {
            fragBinding.gridView.visibility = View.GONE
            fragBinding.kpisNotFound.visibility = View.VISIBLE
        } else {
            fragBinding.gridView.visibility = View.VISIBLE
            fragBinding.kpisNotFound.visibility = View.GONE
        }
       // fragBinding.siteDescriptionVM = kpiViewModel.observableSiteDescription.value
    }

    // ------------------------- RENDER the Menu for fragment--------------------------------------
    private fun setupMenu() {
        setHasOptionsMenu(true)
        (requireActivity() as MenuHost).addMenuProvider(object : MenuProvider {
            override fun onPrepareMenu(menu: Menu) {
                // Handle for example visibility of menu items
            }

            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
                menuInflater.inflate(R.menu.menu_back, menu)
            }

            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if(menuItem.itemId == R.id.item_Back){
                    findNavController().navigate(R.id.action_KPIFragment_to_siteFragment)

                    return true
                }
                return NavigationUI.onNavDestinationSelected(
                    menuItem, requireView().findNavController())
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

    //---------------------------- when Add KPI button pressed-------------------------------------
    private fun showScanQR() {
        Timber.i("DataLogViewer Scan QR selected")
        intentLauncher.launch(Intent(this.context,  QRScanActivity::class.java))
    }
    //---------------------------- when Add KPI button pressed-------------------------------------
    private fun processQRScan(qrCode:String){
        addKPI(qrCode)
    }

    // -------------------------------------------------------------------------------------------
    private fun addKPI(kpiJSONString: String) {
        try {
            var addKPIList: MutableList<PVOModel> = mutableListOf<PVOModel>()
            val gsonBuilder: Gson = GsonBuilder().setPrettyPrinting()
                .create()
            addKPIList = gsonBuilder.fromJson(kpiJSONString, listKpiType)
            for (kpi in addKPIList) {
                kpiViewModel.addKPI(loggedInViewModel.liveUser.value!!.id.toString(),
                    args.siteData
                    ,kpi)
            }
        } catch (e: Exception) {
            Timber.i("Add KPI Error " + e.message)
        }
    }
    // -------------------------- When view is resumed from idle ----------------------------------
    override fun onResume() {
        super.onResume()
        try {
            if (!args.siteID.isEmpty()) {
                kpiViewModel.getTitles(
                    loggedInViewModel.liveUser.value!!.id,
                    args.siteID
                )
                /*
                kpiViewModel.getKPIs(
                    loggedInViewModel.liveUser.value!!.id,
                    args.siteID
                )
                */
                fragBinding.siteDescriptionVM = args.siteDescription
            }
        } catch (e: Exception) {
            Timber.e("KPI Grid onResume error  " + e.message)
            hideLoader(loader)
        }
    }

    // ----------------------- when we go by by ----------------------------------------------
    override fun onDestroyView() {
        super.onDestroyView()
        _fragBinding = null
    }
    /*-------------------------------------------------------------------------------------------*/
    fun setSwipeRefresh() {
        fragBinding.swiperefresh.setOnRefreshListener {
            fragBinding.swiperefresh.isRefreshing = true
            showLoader(loader, "Updating  PVO List")
            kpiViewModel.getKPIs(loggedInViewModel.liveUser.value!!.id,
                args.siteID)
        }
    }

    /*-------------------------------------------------------------------------------------------*/
    fun checkSwipeRefresh() {
        if (fragBinding.swiperefresh.isRefreshing)
            fragBinding.swiperefresh.isRefreshing = false
    }

    /* ----------------------------------------------------------------------------------------- */
}