import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/useAuth'

import { AppRoutes } from './app.routes';

import { Signin } from '../screens/Signin';
import { Box } from 'native-base';

// Se estiver logado mostra as rotas da aplicacao
// Se nao estiver logado mostra a rota do Signin
// Vamos usar o contexto
// Voltar depois para <AppRoutes />
export function Routes(){

    //Este contexto mostra se o usuario está autenticado ou nao.
    const { user } = useAuth();

    return(
    <Box flex={1} bg="gray.900">
       <NavigationContainer>
         {user.name ? <AppRoutes /> : <Signin />}
       </NavigationContainer>
    </Box>
    )
};