package com.in28minutes.oops;

public class MotorBikeRunner {

	public static void main(String[] args) {
		MotorBike ducati = new MotorBike(100);
		MotorBike honda = new MotorBike(100);
		MotorBike suzki = new MotorBike();

		System.out.println(ducati.getSpeed());
		System.out.println(honda.getSpeed());
		System.out.println(suzki.getSpeed());

		ducati.start();
		honda.start();

//		ducati.setSpeed(100);

		ducati.increaseSpeed(100);
		honda.increaseSpeed(100);

		ducati.decreaseSpeed(50);
		honda.decreaseSpeed(50);

		System.out.println(ducati.getSpeed());
		System.out.println(honda.getSpeed());

//		System.out.println(ducati.getSpeed());

//		honda.setSpeed(80);
//		System.out.println(honda.getSpeed());

	}

}
