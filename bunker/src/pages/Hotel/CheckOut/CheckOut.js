import React from "react";
import {Modal, Button, Message, Image, Segment, Grid} from "semantic-ui-react";
import {withFirebase} from "../../../server/Firebase";
import CheckOutForm from "./CheckOutForm";
import PayPalButton from "../../../server/Payment/PayPalButton";
import semanticcss from "semantic-ui-css/semantic.min.css";

const CheckOut = props => {
	const user = JSON.parse(localStorage.getItem("authUser"));
	const [isError, setIsError] = React.useState(false);
	const [isUseReward, setIsUseReward] = React.useState(false);
	const [error, setError] = React.useState(new Error('null'));
	const [isSuccess, setIsSuccess] = React.useState(false);
	const [rewardPoints, setRewardPoints] = React.useState(0);

	React.useEffect( () => {
		const subscribe = props.firebase.subscribeUserReward(user.uid, reward_points => {
			setRewardPoints(reward_points);

		});

		return () => {
			subscribe();
		}
	}, [rewardPoints]);

	const handleUseReward = () => {
		setIsUseReward(!isUseReward);
	};
	console.log(user);
	const {reservation, hotel, datesRange} = props;

	const onSuccess = payment => {
		console.log("Successful payment!", payment);
		const reservation_with_payment = {user_id: user.uid, payment: payment, hotel_id: hotel.id, datesRange, ...reservation, };
		console.log(reservation_with_payment);
		props.firebase.addReservationToDB(
			user.uid,
			reservation_with_payment,
			isUseReward,
			rewardPoints,
		);
		setIsSuccess(payment.paid);
	};

	const onCancel = data => {
		console.log("Cancel: ", data);
	};

	const onError = paypalError => {
		console.log(paypalError);
		setError(paypalError);
		setIsError(true);
	};

	return (
		<Modal
			centered={true}
			size="small"
            role="dialog"
			trigger={
				<Button
					color="blue"
					size="small"
					width="70px"
				>
					Book now
				</Button>
			}
		>
			<Modal.Header>Payment confirmation</Modal.Header>
			<Modal.Content image>
				<Image wrapped size="medium" src={hotel.data.image[0]} />
				<Modal.Description>
					<CheckOutForm
						hotel={hotel}
						reservation={reservation}
						user={user}
						reward_points={rewardPoints}
						isUseReward={isUseReward}
					/>
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Segment>
					<Grid>
						<Grid.Row columns='equal'>
						<Grid.Column>
						<Button floated='left'
					content={
						isUseReward
							? "Reward is used"
							: `Reward left: ${rewardPoints}`
					}
					disabled={rewardPoints <= 0}
					negative={isUseReward}
					positive={!isUseReward}
					onClick={handleUseReward}
				/>
							</Grid.Column>
							<Grid.Column >
						<PayPalButton
					new_end={reservation.end_date}
					new_start={reservation.start_date}
					user_id={user.uid}
					total={reservation.price || 100}
					currency={"USD"}
					commit={true}
					onSuccess={onSuccess}
					onError={onError}
					onCancel={onCancel}
				/>
						</Grid.Column>

						</Grid.Row>
					</Grid>

				</Segment>
			</Modal.Actions>
			{ isError ? (
				<Message negative>
					<Message.Header>Oops!!!</Message.Header>
					{error.message === "MultipleBookingError" ? <p> Multiple Booking Error: Sorry, Bunker does not allow multiple hotel bookings on concurrent dates!</p> :<p>Something went wrong!</p>}
				</Message>
			) : null }
			{ isSuccess ? 			( <Message
			success
			header='Your reservation booking was successful!'
			content='You can view your reservations now at My Reservations'
			/> ) : null

			}
		</Modal>
	);
};

export default withFirebase(CheckOut);