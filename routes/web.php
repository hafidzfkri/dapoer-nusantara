<?php

use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\KitchenController as AdminKitchenController;
use App\Http\Controllers\Admin\MenuController as AdminMenuController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\TableController as AdminTableController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

// Home / Scrollytelling + Katalog
Route::get('/', [MenuController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu.index');
Route::get('/menu/{slug}', [MenuController::class, 'show'])->name('menu.show');
Route::post('/reservations', [ReservationController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('reservations.store');

// Auth (guest)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');

    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])
        ->middleware('throttle:5,1')
        ->name('password.email');

    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:5,1')
        ->name('password.update');
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->name('logout')
    ->middleware('auth');

// Cart, Checkout & Orders (khusus role customer)
Route::middleware(['auth', 'role:customer', 'throttle:30,1'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/delivery-type', [CartController::class, 'setDeliveryType'])->name('cart.delivery');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('checkout.store');
    Route::get('/payment-success/{order}', [CheckoutController::class, 'success'])->name('payment.success');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/reservations', [ReservationController::class, 'index'])->name('reservations.index');
});

// Admin & Staff Dashboard
Route::middleware(['auth', 'permission:dashboard.view'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::middleware('permission:menu.manage')->group(function () {
            Route::get('/menus', [AdminMenuController::class, 'index'])->name('menus.index');
            Route::post('/menus', [AdminMenuController::class, 'store'])->name('menus.store');
            Route::put('/menus/{menu}', [AdminMenuController::class, 'update'])->name('menus.update');
            Route::patch('/menus/{menu}/toggle', [AdminMenuController::class, 'toggleAvailability'])->name('menus.toggle');
            Route::delete('/menus/{menu}', [AdminMenuController::class, 'destroy'])->name('menus.destroy');
        });

        Route::middleware('permission:category.manage')->group(function () {
            Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
            Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
            Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
            Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
        });

        Route::middleware('permission:user.manage')->group(function () {
            Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
            Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role');
            Route::patch('/users/{user}/toggle', [AdminUserController::class, 'toggleStatus'])->name('users.toggle');
        });

        Route::middleware('permission:role.manage')->group(function () {
            Route::get('/roles', [AdminRoleController::class, 'index'])->name('roles.index');
            Route::put('/roles/{role}/permissions', [AdminRoleController::class, 'syncPermissions'])->name('roles.permissions');
        });

        Route::middleware('permission:order.view')->group(function () {
            Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        });

        Route::middleware('permission:order.update_status')->group(function () {
            Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        });

        Route::middleware('permission:kitchen.manage')->group(function () {
            Route::get('/kitchen', [AdminKitchenController::class, 'index'])->name('kitchen.index');
            Route::patch('/kitchen/{order}/prep', [AdminKitchenController::class, 'updatePrepStatus'])->name('kitchen.prep');
        });

        Route::middleware('permission:payment.view')->group(function () {
            Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments.index');
        });

        Route::middleware('permission:payment.confirm')->group(function () {
            Route::post('/payments/{payment}/confirm', [AdminPaymentController::class, 'confirm'])->name('payments.confirm');
        });

        Route::middleware('permission:table.manage')->group(function () {
            Route::get('/tables', [AdminTableController::class, 'index'])->name('tables.index');
            Route::post('/tables', [AdminTableController::class, 'store'])->name('tables.store');
            Route::put('/tables/{table}', [AdminTableController::class, 'update'])->name('tables.update');
            Route::delete('/tables/{table}', [AdminTableController::class, 'destroy'])->name('tables.destroy');
        });

        Route::middleware('permission:reservation.manage')->group(function () {
            Route::get('/reservations', [AdminReservationController::class, 'index'])->name('reservations.index');
            Route::post('/reservations', [AdminReservationController::class, 'store'])->name('reservations.store');
            Route::patch('/reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus'])->name('reservations.status');
        });

        Route::middleware('permission:report.view')->group(function () {
            Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        });

        Route::middleware('permission:activity_log.view')->group(function () {
            Route::get('/activity-logs', [AdminActivityLogController::class, 'index'])->name('activity-logs.index');
        });

        Route::middleware('permission:settings.manage')->group(function () {
            Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        });
    });
