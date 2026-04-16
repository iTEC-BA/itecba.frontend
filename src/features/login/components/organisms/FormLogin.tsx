import { DashboardLayout } from "@/components/templates/DashboardLayout"
import logoItec from '../assets/logo.png'; 
import { useAuth } from "@/context/AuthContext";

function FormLogin() {
  const { user, loginWithGoogle, logout, isAuthenticated, loading, isAdmin } = useAuth();
  
    if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }
  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-itec-blue/20 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="bg-itec-surface border border-itec-gray rounded-3xl p-10 max-w-md w-full text-center shadow-2xl relative z-10">
            <div className="w-33 h-33 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <img src={logoItec} alt="Logo" className="w-33 h-33 object-contain" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Portal ITEC</h1>
            <p className="text-gray-400 text-sm mb-8">Accedé a tus beneficios y apuntes usando tu cuenta de la facultad.</p>
            
            <button 
              onClick={loginWithGoogle}
              className="w-full bg-itec-red hover:bg-itec-red/50 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg cursor-pointer"
            >
              <div className="w-5 h-5"><Icons type="google" /></div>
              Iniciar sesión con @frba
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default FormLogin