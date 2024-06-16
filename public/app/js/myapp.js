var app = new Vue({
    el: '#app',
    data: {
        entrenadores: [],
        selectedEntrenador: null,
        batallaEntrenador1: null,
        batallaEntrenador2: null,
        showBattleModal: false,
        countdown: 0
    },
    created() {
        fetch('app/json/pokemon_data.json')
            .then(response => response.json())
            .then(data => {
                this.entrenadores = data;
            })
            .catch(error => {
                console.error('Error al cargar entrenadores:', error);
            });
    },
    methods: {
        selectEntrenador(entrenador) {
            this.selectedEntrenador = entrenador;
            document.body.classList.add('overflow-hidden');
        },
        closeEntrenador() {
            this.selectedEntrenador = null;
            document.body.classList.remove('overflow-hidden');
        },
        closeModalOutside(event) {
            if (event.target === event.currentTarget) {
                this.closeEntrenador();
            }
        },
        selectForBattle(entrenador) {
            if (!this.batallaEntrenador1) {
                this.batallaEntrenador1 = entrenador;
            } else if (!this.batallaEntrenador2) {
                this.batallaEntrenador2 = entrenador;
            }
        },
        removeBattleEntrenador(entrenador) {
            if (this.batallaEntrenador1 === entrenador) {
                this.batallaEntrenador1 = null;
            } else if (this.batallaEntrenador2 === entrenador) {
                this.batallaEntrenador2 = null;
            }
        },
        startNewBattle() {
            if (this.batallaEntrenador1 && this.batallaEntrenador2) {
                this.countdown = 3;
                const countdownInterval = setInterval(() => {
                    this.countdown--;
                    if (this.countdown === 0) {
                        clearInterval(countdownInterval);
                        this.showBattleModal = true;
                        document.body.classList.add('overflow-hidden');
                    }
                }, 1000);
            }
        },
        closeBattleModal() {
            this.showBattleModal = false;
            this.batallaEntrenador1 = null;
            this.batallaEntrenador2 = null;
            this.countdown = 0;
            document.body.classList.remove('overflow-hidden');
        },
        closeBattleModalOutside(event) {
            if (event.target === event.currentTarget) {
                this.closeBattleModal();
            }
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    template: `
        <div class="container mx-auto p-4">
            <div id="entrenadores">
                <h1 class="text-3xl font-bold mb-4 text-center">Entrenadores Pokémon ({{ entrenadores.length }})</h1>
                <div class="text-center my-8">
                    <button @click="startNewBattle" :disabled="!batallaEntrenador1 || !batallaEntrenador2" class="bg-red-600 text-white py-2 px-6 rounded" :class="{ 'opacity-50': !batallaEntrenador1 || !batallaEntrenador2 }">Nuevo combate</button>
                </div>
                <div class="text-center my-4">
                    <div v-if="batallaEntrenador1" class="inline-block bg-gray-200 text-gray-700 py-1 px-3 rounded-full mx-2">
                        {{ batallaEntrenador1.entrenador }}
                        <button @click="removeBattleEntrenador(batallaEntrenador1)" class="ml-2 text-red-500">&times;</button>
                    </div>
                    <div v-if="batallaEntrenador2" class="inline-block bg-gray-200 text-gray-700 py-1 px-3 rounded-full mx-2">
                        {{ batallaEntrenador2.entrenador }}
                        <button @click="removeBattleEntrenador(batallaEntrenador2)" class="ml-2 text-red-500">&times;</button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="entrenador in entrenadores" :key="entrenador.entrenador" class="p-4 border rounded-lg shadow-lg">
                        <img :src="entrenador.imagen" alt="entrenador.entrenador" class="w-40 h-72 object-cover mx-auto">
                        <h2 class="text-xl font-semibold text-center mt-2">{{ entrenador.entrenador }}</h2>
                        <div class="flex flex-col">
                          <button @click="selectEntrenador(entrenador)" class="mt-2 bg-blue-500 text-white py-1 px-4 rounded">Ver Pokémons</button>
                          <button @click="selectForBattle(entrenador)" class="mt-2 bg-green-500 text-white py-1 px-4 rounded">Seleccionar para combate</button>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-8">
                    <button @click="scrollToTop" class="bg-blue-500 text-white py-2 px-6 rounded">Ir al principio</button>
                </div>
            </div>
            <div v-if="selectedEntrenador" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center" @click="closeModalOutside">
                <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto sm:max-h-none sm:overflow-y-visible" @click.stop>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold text-center">{{ selectedEntrenador.entrenador }}</h2>
                        <button @click="closeEntrenador" class="text-red-500 text-2xl">&times;</button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="pokemon in selectedEntrenador.pokemons" :key="pokemon.nombre" class="p-4 border rounded-lg shadow-lg">
                            <img :src="pokemon.imagen" alt="pokemon.nombre" class="w-24 h-24 object-cover mx-auto">
                            <h3 class="text-lg font-semibold text-center mt-2">{{ pokemon.nombre }}</h3>
                        </div>
                    </div>
                    <button @click="closeEntrenador" class="mt-4 bg-red-500 text-white py-1 px-4 rounded">Cerrar</button>
                </div>
            </div>
            <div v-if="showBattleModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center" @click="closeBattleModalOutside">
                <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto sm:max-h-none sm:overflow-y-visible" @click.stop>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold text-center">Nuevo combate entre {{ batallaEntrenador1.entrenador }} vs {{ batallaEntrenador2.entrenador }}</h2>
                        <button @click="closeBattleModal" class="text-red-500 text-2xl">&times;</button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-4 border rounded-lg shadow-lg">
                            <h3 class="text-xl font-semibold text-center">{{ batallaEntrenador1.entrenador }}</h3>
                            <div class="grid grid-cols-2 gap-2 mt-2">
                                <div v-for="pokemon in batallaEntrenador1.pokemons" :key="pokemon.nombre" class="p-2 border rounded-lg shadow">
                                    <img :src="pokemon.imagen" alt="pokemon.nombre" class="w-16 h-16 object-cover mx-auto">
                                    <h4 class="text-center text-sm">{{ pokemon.nombre }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 border rounded-lg shadow-lg">
                            <h3 class="text-xl font-semibold text-center">{{ batallaEntrenador2.entrenador }}</h3>
                            <div class="grid grid-cols-2 gap-2 mt-2">
                                <div v-for="pokemon in batallaEntrenador2.pokemons" :key="pokemon.nombre" class="p-2 border rounded-lg shadow">
                                    <img :src="pokemon.imagen" alt="pokemon.nombre" class="w-16 h-16 object-cover mx-auto">
                                    <h4 class="text-center text-sm">{{ pokemon.nombre }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button @click="closeBattleModal" class="mt-4 bg-red-500 text-white py-1 px-4 rounded">Cerrar</button>
                </div>
            </div>
            <div v-if="countdown > 0" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                <div class="text-white text-6xl">{{ countdown }}</div>
            </div>
        </div>
    `
});